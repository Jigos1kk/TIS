# Routes (`src/routes/`)

Слой HTTP-маршрутизации (Express Routers).

## Содержимое
- `oidc.route.ts` — подключение OIDC engine (`oidc.callback()`) и эндпоинтов спецификации OpenID Connect.
- `interaction.route.ts` — маршруты UI взаимодействия OIDC (`/interaction/:uid` — логин, согласие/consent, выбор аккаунта, логаут).
- `system.route.ts` — сервисные эндпоинты (`/health`, `/ready`, метрики).
- `api/` — внутренние REST API маршруты (управление пользователями, клиентами, сессиями).
- `index.ts` — объединение всех роутов в единый роутер приложения.

## Правила
- Роуты лишь связывают URL-пути, middleware и контроллеры/OIDC-движок.
