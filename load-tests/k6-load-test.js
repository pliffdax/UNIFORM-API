import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

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
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  const uniqueId = `${__VU}-${__ITER}`;

  const registerPayload = JSON.stringify({
    email: `user${uniqueId}@test.com`,
    password: 'password123',
    username: `user${uniqueId}`,
  });

  const registerRes = http.post(`${BASE_URL}/auth/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (
    !check(registerRes, {
      'registration status is 201/409': (r) =>
        r.status === 201 || r.status === 409,
    })
  ) {
    errorRate.add(1);
  }

  sleep(1);

  const loginPayload = JSON.stringify({
    email: `user${uniqueId}@test.com`,
    password: 'password123',
  });

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (
    !check(loginRes, {
      'login status is 200/201': (r) => r.status === 200 || r.status === 201,
    })
  ) {
    errorRate.add(1);
    return;
  }

  const loginBody = loginRes.json();
  const token = loginBody && loginBody.accessToken;

  if (!token) {
    errorRate.add(1);
    return;
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  sleep(1);

  const listEndpoints = ['/faculties', '/categories', '/questions', '/answers'];

  for (const path of listEndpoints) {
    const res = http.get(`${BASE_URL}${path}`, {
      headers: authHeaders,
    });

    if (
      !check(res, {
        [`${path} status 200`]: (r) => r.status === 200,
        [`${path} < 500ms`]: (r) => r.timings.duration < 500,
      })
    ) {
      errorRate.add(1);
    }

    sleep(0.5);
  }

  const profilesRes = http.get(`${BASE_URL}/profiles`, {
    headers: authHeaders,
  });

  if (
    !check(profilesRes, {
      'profiles status 200': (r) => r.status === 200,
    })
  ) {
    errorRate.add(1);
    return;
  }

  let profiles = [];
  try {
    profiles = profilesRes.json();
  } catch (_e) {
    errorRate.add(1);
    return;
  }

  if (profiles && profiles.length > 0) {
    const firstProfileId = profiles[0].id;

    const profileRes = http.get(`${BASE_URL}/profiles/${firstProfileId}`, {
      headers: authHeaders,
    });

    if (
      !check(profileRes, {
        'profile by id 200': (r) => r.status === 200,
      })
    ) {
      errorRate.add(1);
    }

    sleep(0.5);
  }

  sleep(1);
}
