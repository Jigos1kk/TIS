# OIDC Engine & Adapters (`src/oidc/`)

Специализированный слой настройки `oidc-provider` и реализации адаптера хранилища.

## Содержимое
- `adapter.ts` — реализация `Adapter` интерфейса `oidc-provider` поверх TypeORM (сохранение Grant, Session, AccessToken, AuthorizationCode, RefreshToken в PostgreSQL).
- `configuration.ts` — фабрика конфигурации OIDC (claims, scopes, findAccount, cookies, jwks, interactions, routes).
- `accounts.ts` — реализация интерфейса `Account` для резолвинга claims пользователя (`sub`, `email`, `profile` и т.д.).
- `clients.ts` — загрузка клиентов (динамическая из БД или статическая).

## Правила
- Вся OIDC-специфичная конфигурация и интерфейсы протокола инкапсулируются в этом модуле.
