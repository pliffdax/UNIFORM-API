import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const PASSWORD = __ENV.K6_PASSWORD || 'Password_123!';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.02'],
    errors: ['rate<0.02'],
  },
};

function randId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function registerOnce(email, username) {
  const payload = JSON.stringify({
    email,
    password: PASSWORD,
    username,
  });

  const res = http.post(`${BASE_URL}/auth/register`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /auth/register' },
  });

  const ok =
    check(res, {
      'register status 200/201/409': (r) =>
        r.status === 200 || r.status === 201 || r.status === 409,
    }) || false;

  if (!ok) errorRate.add(1);

  return res.status;
}

function login(email) {
  const payload = JSON.stringify({
    email,
    password: PASSWORD,
  });

  const res = http.post(`${BASE_URL}/auth/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /auth/login' },
  });

  const ok =
    check(res, {
      'login status 200/201': (r) => r.status === 200 || r.status === 201,
    }) || false;

  if (!ok) {
    errorRate.add(1);
    return null;
  }

  const body = res.json();
  const token = body && body.accessToken;
  if (!token) {
    errorRate.add(1);
    return null;
  }

  return token;
}

export function setup() {
  const id = randId();
  const email = `k6_${id}@test.local`;
  const username = `k6_${id}`;

  registerOnce(email, username);

  sleep(0.2);

  return { email };
}

let cachedToken = null;

export default function (data) {
  if (!cachedToken) {
    cachedToken = login(data.email);
    if (!cachedToken) {
      sleep(1);
      return;
    }
  }

  const authHeaders = {
    Authorization: `Bearer ${cachedToken}`,
  };

  const listEndpoints = ['/faculties', '/categories', '/questions', '/answers'];

  for (const path of listEndpoints) {
    const res = http.get(`${BASE_URL}${path}`, {
      headers: authHeaders,
      tags: { name: `GET ${path}` },
    });

    const ok =
      check(res, {
        [`${path} status 200`]: (r) => r.status === 200,
        [`${path} p95<500ms (soft)`]: (r) => r.timings.duration < 500,
      }) || false;

    if (!ok) errorRate.add(1);

    sleep(0.2);
  }

  const profilesRes = http.get(`${BASE_URL}/profiles`, {
    headers: authHeaders,
    tags: { name: 'GET /profiles' },
  });

  const profilesOk =
    check(profilesRes, {
      'profiles status 200': (r) => r.status === 200,
    }) || false;

  if (!profilesOk) {
    errorRate.add(1);
    sleep(0.5);
    return;
  }

  const profilesBody = profilesRes.json();
  const firstProfileId =
    Array.isArray(profilesBody) && profilesBody.length > 0
      ? profilesBody[0]?.id
      : null;

  if (firstProfileId) {
    const profileRes = http.get(`${BASE_URL}/profiles/${firstProfileId}`, {
      headers: authHeaders,
      tags: { name: 'GET /profiles/:id' },
    });

    const ok =
      check(profileRes, {
        'profile by id 200': (r) => r.status === 200,
      }) || false;

    if (!ok) errorRate.add(1);
  }

  sleep(0.5);
}
