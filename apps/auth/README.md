# Tiny Identity System — Auth Service (SSO / OIDC)

Сервис централизованной аутентификации и авторизации (Single Sign-On) на базе протокола **OpenID Connect (OIDC)** и **OAuth 2.0**.

---

## Технологический стек
- **Runtime & Language:** Node.js, TypeScript (ESM)
- **Web-фреймворк:** Express 5
- **OIDC Core:** `oidc-provider`
- **ORM & Database:** TypeORM, PostgreSQL (`pg`)
- **Конфигурация:** `dotenv`

---

## Архитектура проекта (`src/`)

```text
apps/auth/
├── scripts/                # Скрипты генерации ключей (JWKS, cookies)
├── secrets/                # Хранилище локальных секретов и ключей
├── src/
│   ├── common/             # Общие типы, утилиты, кастомные ошибки, константы
│   ├── config/             # Чтение env, валидация настроек (dotenv)
│   ├── controllers/        # Express контроллеры (обработка HTTP, UI взаимодействия)
│   ├── database/           # TypeORM: сущности (entities), репозитории, миграции
│   ├── middlewares/        # Express middlewares (ошибки, валидация, rate-limit, cors)
│   ├── oidc/               # Конфигурация oidc-provider, custom Adapter (TypeORM), claims
│   ├── providers/          # Провайдеры ключей JWKS/Cookie, внешние провайдеры
│   ├── routes/             # Express маршруты (oidc, interactions, system, api)
│   ├── services/           # Бизнес-логика (пользователи, хеширование, consent, сессии)
│   ├── index.ts            # Точка входа: bootstrap БД и HTTP-сервера
│   └── server.ts           # Инициализация и конфигурирование Express приложения
├── package.json
└── tsconfig.json
```

---

## Полный чек-лист реализации SSO приложения

### Этап 1. Конфигурация и окружение
- [ ] Настроить строгую валидацию переменных окружения в `src/config/env.ts` (порт, хост, issuer URL, параметры подключения к PostgreSQL, секреты cookie, путь к JWKS).
- [ ] Обеспечить безопасную генерацию и хранение ротируемых ключей:
  - [ ] JWKS (`secrets/jwks.json`) для подписи id_token и access_token (RSA/EC ключи).
  - [ ] Cookie secrets (`secrets/cookies.json`) для подписи сессионных кук `oidc-provider`.
- [ ] Настроить доверенные прокси (`server.set('trust proxy', true)`) для корректной генерации redirect URL при работе за Nginx / Traefik / Docker.

### Этап 2. Слой данных и персистентность (TypeORM + PostgreSQL)
- [ ] Описать сущность `User` (`src/database/entity/User.entity.ts`):
  - [ ] `id` (UUIDv4)
  - [ ] `email` (unique, indexed)
  - [ ] `passwordHash`
  - [ ] `isEmailVerified` (boolean)
  - [ ] `profile` (first_name, last_name, avatar_url)
  - [ ] `roles` / `permissions`
  - [ ] `createdAt`, `updatedAt`
- [ ] Реализовать кастомный TypeORM адаптер для `oidc-provider` (`src/oidc/adapter.ts`):
  - [ ] Создать универсальную сущность OIDC моделей (`OidcPayload.entity.ts`: `id`, `type`, `payload`, `grantId`, `userCode`, `uid`, `expiresAt`).
  - [ ] Реализовать обязательные методы `Adapter`: `upsert`, `find`, `findByUserCode`, `findByUid`, `destroy`, `revokeByGrantId`, `consume`.
  - [ ] Настроить автоочистку устаревших токенов/сессий по `expiresAt` (TTL индекс или cron job).
- [ ] Настроить миграции TypeORM для создания таблиц в PostgreSQL.

### Этап 3. Ядро OIDC (`oidc-provider`)
- [ ] Сконфигурировать `oidc-provider` (`src/oidc/configuration.ts`):
  - [ ] Задать `adapter` (передать TypeORM адаптер).
  - [ ] Настроить поддерживаемые `scopes` (`openid`, `profile`, `email`, `offline_access`, `roles`).
  - [ ] Настроить маппинг `claims` (сопоставление полей пользователя с OpenID claims).
  - [ ] Реализовать функцию `findAccount(ctx, id)` для резолвинга пользователя из TypeORM репозитория.
  - [ ] Задать параметры времени жизни токенов (TTL для `AccessToken`, `IdToken`, `RefreshToken`, `AuthorizationCode`, `Session`).
  - [ ] Включить необходимые features:
    - [ ] `devInteractions` — отключить в production в пользу кастомного UI.
    - [ ] `revocation` (RFC 7009) — отзыв токенов.
    - [ ] `introspection` (RFC 7662) — проверка валидности токенов для Resource Servers.
    - [ ] `rpInitiatedLogout` — централизованный выход (Single Logout).
    - [ ] `pkce` — включить обязательный PKCE (S256) для SPA и мобильных клиентов.
- [ ] Настроить регистрацию клиентов (Clients):
  - [ ] Поддержка динамической загрузки клиентов из БД или статическая конфигурация доверенных клиентов (`client_id`, `client_secret`, `redirect_uris`, `post_logout_redirect_uris`, `grant_types`, `response_types`).

### Этап 4. Сценарии взаимодействия пользователя (Interactions UI / UX)
- [ ] Настроить кастомные URL взаимодействий в `oidc-provider` (`/interaction/:uid`).
- [ ] Создать роуты и контроллеры `src/routes/interaction.route.ts`:
  - [ ] **GET `/interaction/:uid`** — анализ деталей взаимодействия (`oidc.interactionDetails(req, res)`): определение типа (login или consent).
  - [ ] **POST `/interaction/:uid/login`** — аутентификация пользователя:
    - [ ] Валидация входных данных (email, password).
    - [ ] Проверка хеша пароля через `UserService`.
    - [ ] Завершение взаимодействия: `oidc.interactionFinished(req, res, { login: { accountId } })`.
  - [ ] **POST `/interaction/:uid/confirm` (Consent)** — подтверждение разрешений (scopes):
    - [ ] Создание/получение Grant.
    - [ ] Завершение взаимодействия: `oidc.interactionFinished(req, res, { consent: { grantId } })`.
  - [ ] **POST `/interaction/:uid/abort`** — отмена авторизации пользователем с передачей ошибки OIDC клиенту (`access_denied`).
- [ ] Реализовать страницы взаимодействия (SSR через шаблонизатор, либо API для интеграции с SPA frontend).

### Этап 5. Обеспечение Single Sign-On (SSO) и сессий
- [ ] Настройка SSO-cookie:
  - [ ] Корректные флаги `httpOnly: true`, `secure: true` (в prod), `sameSite: 'lax'`.
  - [ ] Доменная привязка cookie (если приложения работают на поддоменах одного домена).
- [ ] Бесшовный вход:
  - [ ] Если у пользователя есть активная сессия в провайдере, повторный запрос авторизации от другого клиента с `prompt=none` или без `prompt` автоматически выдаёт authorization code без повторного ввода пароля.
- [ ] Реализация Single Logout (SLO):
  - [ ] Завершение сессии в провайдере через `/oauth/session/end`.
  - [ ] Оповещение подключенных клиентов через Back-Channel Logout или Front-Channel Logout (при необходимости).

### Этап 6. Безопасность и защита
- [ ] Валидация всех входящих DTO (включая регистрацию, смену пароля).
- [ ] Защита от брутфорса и атак подбора паролей:
  - [ ] Rate-limiting на эндпоинты `/interaction/:uid/login` и `/oauth/token`.
  - [ ] Временная блокировка аккаунта при превышении неудачных попыток входа.
- [ ] Защита от CSRF на формах interactions.
- [ ] Корректная конфигурация CORS:
  - [ ] Строгое ограничение разрешённых origins для API и токен-эндпоинтов.
- [ ] Безопасные HTTP-заголовки (Helmet / Content-Security-Policy).
- [ ] Маскирование внутренних ошибок сервера в production.

### Этап 7. Тестирование и верификация
- [ ] Unit-тесты для `UserService` и TypeORM репозиториев.
- [ ] Интеграционные тесты OIDC потоков:
  - [ ] Authorization Code Flow с PKCE (успешный обмен кода на токены).
  - [ ] Валидация сигнатуры JWT токенов с использованием публичного JWKS эндпоинта.
  - [ ] Сценарий Refresh Token (ротация токенов).
  - [ ] Сценарий SSO: проверка входа во второе клиентское приложение с существующей сессией.
  - [ ] Сценарий Logout: инвалидация сессии.
