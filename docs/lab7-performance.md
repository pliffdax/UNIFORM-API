# Лабораторна робота №7 — Перформанс

**Проєкт:** `uniform-api` (NestJS + Prisma + PostgreSQL)

> **Студент:** Степанов Олександр Олександрович  
> **Група:** ІО-35

---

## 1. Мета роботи

1. Виконати аналіз фронтенду (за наявності) інструментами Lighthouse / Web Vitals.
2. Підготувати та виконати навантажувальне тестування типовими сценаріями використання.
3. Запустити сервер із профілюванням і зібрати дані щодо використання CPU/RAM.
4. Проаналізувати запити до БД вбудованими інструментами PostgreSQL.

---

## 2. Короткий опис системи

- **Тип:** REST API.
- **Фреймворк:** NestJS (`@nestjs/core`).
- **БД:** PostgreSQL 15 (у Docker).
- **ORM:** Prisma (`@prisma/client`).
- **Документація API:** Swagger UI на `GET /swagger`.
- **Основні модулі:** `auth`, `profiles`, `questions`, `answers`, `categories`, `faculties`, тощо.

---

## 3. Оточення та відтворюваність

### 3.1. Режим запуску (використаний під час замірів)

Через проблему сумісності Prisma у контейнері (OpenSSL) бекенд запускався **локально**, а PostgreSQL — **в Docker**.

**Підняти БД:**

```bash
docker compose up -d db
```

**Задати підключення до БД (порт з compose: 5430 → 5432):**

```bash
export DATABASE_URL="postgresql://uniflow_user:uniflow_password@localhost:5430/uniflow_db?schema=public"
```

**Міграції та сіди:**

```bash
pnpm install
pnpm prisma migrate deploy
pnpm prisma db seed
```

**Prod-запуск із CPU профілем:**

```bash
pnpm build
node --cpu-prof --cpu-prof-dir=artifacts dist/main
```

---

## 4. Аналіз фронтенду (Lighthouse / Web Vitals)

### 4.1. Інструмент та ціль

Аудит виконано для Swagger UI: `http://localhost:3000/swagger`  
Артефакти:

- `artifacts/lighthouse.swagger.html`
- `artifacts/lighthouse.swagger.json`

### 4.2. Результати Lighthouse

**Scores:**

- Performance: **56 / 100**
- Accessibility: **86 / 100**
- Best Practices: **93 / 100**
- SEO: **80 / 100**

**Ключові метрики:**

- FCP: **10.8 s**
- LCP: **10.8 s**
- Speed Index: **10.8 s**
- TBT: **10 ms**
- CLS: **0**
- Time to Interactive: **10.9 s**
- Server response time (TTFB): **Root document took 0 ms**
- DOM size: **1,039 elements**

### 4.3. Виявлені проблеми та рекомендації

1. **Велика кількість/вага JS та CSS для Swagger UI**
   - Unused JavaScript: **Est savings of 992 KiB**
   - Unused CSS: **Est savings of 141 KiB**
2. **Render-blocking ресурси**
   - Render-blocking resources: **Est savings of 10,220 ms**
3. **Відсутність стиснення текстових ресурсів**
   - Text compression: **Est savings of 1,381 KiB**
4. **Legacy JavaScript**
   - Legacy JS: **Est savings of 57 KiB**

**Рекомендації:**

- Увімкнути gzip/brotli для відповіді сервера (middleware `compression` у NestJS).
- Налаштувати кешування статичних ресурсів/документації (Cache-Control) і, за потреби, винести Swagger у окремий профіль/режим (наприклад, вимикати в production або розміщувати окремо).
- Мінімізувати/обмежити Swagger UI для продуктивного середовища (це dev-інструмент і не є “клієнтським фронтом” сервісу).

---

## 5. Навантажувальне тестування (k6)

### 5.1. Сценарій та покриття системи

Сценарій описаний у файлі: `load-tests/k6-load-test.js`  
Покриває:

- `POST /auth/register`
- `POST /auth/login`
- списки: `GET /faculties`, `GET /categories`, `GET /questions`, `GET /answers`
- `GET /profiles`
- `GET /profiles/{id}`

### 5.2. Параметри навантаження (stages)

- 30s → 10 VU
- 1m → 50 VU
- 30s → 100 VU
- 1m → 50 VU
- 30s → 0 VU

### 5.3. Команда запуску

```bash
API_URL=http://localhost:3000 k6 run load-tests/k6-load-test.js \
  --summary-export artifacts/k6-summary.json | tee artifacts/k6-output.txt
```

### 5.4. Підсумкові метрики (за `k6-summary.json`)

- Кількість HTTP запитів: **13944**
- Середній RPS: **65.31 req/s**
- Кількість ітерацій сценарію: **1743** (≈ **8.16 iter/s**)
- Передано даних:
  - sent: **3.84 MiB**
  - received: **11.72 MiB**

**Затримки (http_req_duration):**

- p(90): **55.83 ms**
- p(95): **72.47 ms**
- median: **1.43 ms**
- avg: **10.21 ms**
- min / max: **0.35 ms / 114.36 ms**

**Розкладка часу запиту (середні значення):**

- waiting (TTFB/app): **10.18 ms**
- sending: **0.010 ms**
- receiving: **0.024 ms**
- blocked: **0.006 ms**
- connecting: **0.002 ms**

### 5.5. Інтерпретація `http_req_failed`

`http_req_failed` = **12.40%** (≈ **1729** запитів).  
Це очікувано для даного сценарію: реєстрація допускає статус **201 або 409**, але для k6 “expected_response=true” статус **409** вважається “failed request”. Водночас перевірки (`checks`) для реєстрації та логіна пройдені успішно.

**Що можна покращити для точнішого вимірювання помилок:**

- Генерувати унікальний username/email на кожну ітерацію (щоб уникати 409), або
- Позначати 409 як очікуваний результат на рівні метрики/тегів.

---

## 6. Профілювання CPU та використання RAM

### 6.1. CPU profiling

Профіль CPU зібрано запуском:

```bash
node --cpu-prof --cpu-prof-dir=artifacts dist/main
```

Артефакт: `artifacts/CPU.*.cpuprofile`  
Аналіз виконується у Chrome DevTools (Performance / Load profile) або `chrome://tracing`.

### 6.2. RAM (RSS) під час тесту

Для контролю використано визначення PID процесів через `lsof -ti :3000` та замір:

```bash
ps -o pid,rss,%mem,command -p <PID>
```

**Приклад зафіксованих значень під час навантаження:**
| Процес | PID | RSS (KB) | RSS (MB) | Коментар |
|---|---:|---:|---:|---|
| API (Node.js) | 57914 | 165312 | 161.4 | `node --cpu-prof ... dist/main` |
| k6 | 64454 | 67312 | 65.7 | `k6 run ...` |

> Для фінального звіту бажано додати ще 2–3 заміри (старт/пік/кінець), щоб показати динаміку.

---

## 7. Аналіз запитів до БД (вбудованими інструментами PostgreSQL)

### 7.1. Інструмент

Застосовано розширення **pg_stat_statements** для агрегованої статистики по запитах (кількість викликів та час виконання).

### 7.2. Команди

> Увімкнення розширення потребує `shared_preload_libraries`. У Docker-Postgres це налаштовано через `command` у `docker-compose.yaml`, після чого контейнер БД перезапущено.

Підключення:

```bash
docker exec -it uniform-api-db-1 psql -U uniflow_user -d uniflow_db
```

Запит top-10:

```sql
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

Артефакт: `artifacts/db-top-queries.txt`

### 7.3. Висновки по БД (за top-10)

- Найчастіше виконуються запити на отримання списків (questions/answers/categories/faculties/profiles) та пошук користувача за `email/username`.
- За схемою Prisma поля `User.email` та `User.username` мають `@unique`, що забезпечує індексацію та швидкий пошук.
- У топі присутній `INSERT INTO "User"` (реєстрація) — частина навантаження генерує конфлікти (409), що узгоджується з k6.

---

## 8. Узагальнені висновки

1. **Swagger UI** має відносно низький Performance score (**56/100**) через велику кількість JS/CSS, render-blocking ресурси та відсутність стиснення.
2. Навантаження k6 (до 100 VU) показало **p95 ≈ 72.47 ms** для `http_req_duration` і **≈ 65.31 req/s**.
3. Значення `http_req_failed` (**12.40%**) зумовлене переважно відповідями **409 Conflict** на повторну реєстрацію — це не критична деградація продуктивності, але потребує коригування сценарію для “чистих” метрик помилок.
4. За статистикою PostgreSQL (pg_stat_statements) переважають типові `SELECT` для списків та пошуку користувача; індексація унікальних полів присутня, що сприяє швидкому доступу.
5. Зібрані артефакти (Lighthouse, k6, CPU профіль, статистика БД) формують базу для наступної роботи (ЛР8) — вибору вузького місця та рефакторингу/винесення модуля.

---

## 9. Додатки (артефакти)

- `artifacts/lighthouse.swagger.html`, `artifacts/lighthouse.swagger.json`
- `artifacts/k6-output.txt`, `artifacts/k6-summary.json`
- `artifacts/CPU.*.cpuprofile`
- `artifacts/db-top-queries.txt`
- `artifacts/api-log.txt` (журнал запитів Prisma/Nest)

---

## Додаток A — Top-10 запитів (pg_stat_statements)

Нижче наведено вивід з `artifacts/db-top-queries.txt`:

```text
query                                                                                                                                                                                                                                                                                | calls |    mean_exec_time    |  total_exec_time
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-------+----------------------+--------------------
 SELECT "public"."User"."id", "public"."User"."username", "public"."User"."email", "public"."User"."password", "public"."User"."isStaff", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE ("public"."User"."email" = $1 OR "public"."User"."username" = $2) LIMIT $3 OFFSET $4                                                                                                                                                                                                                                                  |  1741 |  0.05273411085582995 |  91.81008699999995
 SELECT "public"."User"."id", "public"."User"."username", "public"."User"."email", "public"."User"."password", "public"."User"."isStaff", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE ("public"."User"."email" = $1 AND $4=$5) LIMIT $2 OFFSET $3                                                                                                                                                                                                                                                                           |  1741 |  0.04081646869615173 |  71.06147199999994
 SELECT "public"."Question"."id", "public"."Question"."questionName", "public"."Question"."questionText", "public"."Question"."likes", "public"."Question"."shareUrl", "public"."Question"."category", "public"."Question"."status", "public"."Question"."userId", "public"."Question"."created_at", "public"."Question"."updated_at" FROM "public"."Question" WHERE $2=$3 OFFSET $1                                                                                                                                                                                |  1741 |  0.03176184951177484 |  55.29738000000004
 SELECT "public"."Answer"."id", "public"."Answer"."answerText", "public"."Answer"."shareUrl", "public"."Answer"."likes", "public"."Answer"."acceptedAnswer", "public"."Answer"."category", "public"."Answer"."questionId", "public"."Answer"."userId", "public"."Answer"."created_at", "public"."Answer"."updated_at" FROM "public"."Answer" WHERE $2=$3 OFFSET $1                                                                                                                                                                                                  |  1741 | 0.030862218265364727 |  53.73112199999995
 SELECT "public"."UserProfile"."id", "public"."UserProfile"."userId", "public"."UserProfile"."firstName", "public"."UserProfile"."lastName", "public"."UserProfile"."role", "public"."UserProfile"."group", "public"."UserProfile"."facultyId", "public"."UserProfile"."questions", "public"."UserProfile"."answers", "public"."UserProfile"."avatarUrl", "public"."UserProfile"."status", "public"."UserProfile"."createdAt", "public"."UserProfile"."updatedAt" FROM "public"."UserProfile" WHERE $2=$3 OFFSET $1                                                 |  1741 | 0.029048537622056305 |  50.57350400000008
 SELECT "public"."Category"."id", "public"."Category"."name", "public"."Category"."slug", "public"."Category"."created_at", "public"."Category"."updated_at" FROM "public"."Category" WHERE $2=$3 OFFSET $1                                                                                                                                                                                                                                                                                                                                                         |  1741 |  0.02474631591039631 | 43.083336000000024
 SELECT "public"."Faculty"."id", "public"."Faculty"."name", "public"."Faculty"."createdAt", "public"."Faculty"."updatedAt" FROM "public"."Faculty" WHERE $2=$3 OFFSET $1                                                                                                                                                                                                                                                                                                                                                                                            |  1741 |  0.02226758070074669 | 38.767858000000025
 SELECT "public"."UserProfile"."id", "public"."UserProfile"."userId", "public"."UserProfile"."firstName", "public"."UserProfile"."lastName", "public"."UserProfile"."role", "public"."UserProfile"."group", "public"."UserProfile"."facultyId", "public"."UserProfile"."questions", "public"."UserProfile"."answers", "public"."UserProfile"."avatarUrl", "public"."UserProfile"."status", "public"."UserProfile"."createdAt", "public"."UserProfile"."updatedAt" FROM "public"."UserProfile" WHERE ("public"."UserProfile"."id" = $1 AND $4=$5) LIMIT $2 OFFSET $3 |  1741 | 0.021753261344055155 |  37.87242799999997
 SELECT "public"."UserProfile"."id", "public"."UserProfile"."userId", "public"."UserProfile"."firstName", "public"."UserProfile"."lastName", "public"."UserProfile"."role", "public"."UserProfile"."group", "public"."UserProfile"."facultyId", "public"."UserProfile"."questions", "public"."UserProfile"."answers", "public"."UserProfile"."avatarUrl", "public"."UserProfile"."status", "public"."UserProfile"."createdAt", "public"."UserProfile"."updatedAt" FROM "public"."UserProfile" WHERE "public"."UserProfile"."userId" IN ($1) OFFSET $2               |  1762 | 0.013965198637911473 | 24.606679999999972
 INSERT INTO "public"."User" ("id","username","email","password","isStaff","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING "public"."User"."id"                                                                                                                                                                                                                                                                                                                                                                                                    |    21 |  0.20910309523809525 |           4.391165
(10 rows)
```
