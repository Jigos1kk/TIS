# Middlewares (`src/middlewares/`)

Промежуточные обработчики запросов Express (Middleware).

## Содержимое
- `error.middleware.ts` — централизованная обработка ошибок и форматирование ответов (включая OIDC ошибки).
- `auth.middleware.ts` — проверка токенов/сессий для защищённых внутренних эндпоинтов.
- `validation.middleware.ts` — валидация тела запроса, query и params (DTO).
- `rate-limit.middleware.ts` — ограничение частоты запросов к эндпоинтам авторизации для защиты от брутфорса.
- `cors.middleware.ts` — централизованная настройка CORS.
