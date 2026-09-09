# Архітектура OGOROD

OGOROD — offline-first PWA. Один код для hosted і self-hosted. Цей етап — фундамент **без** UI «Додати спостереження».

Ключова ідея: **три типи даних не змішуються**.

```
┌──────────────────────────────────┐
│       GLOBAL KNOWLEDGE (KB)      │
│ species · cultivar · disease     │
│ (+ cultivation rules, genetics)  │
│ ревізія каталогу: 1 → 2 → …      │
└────────────────┬─────────────────┘
                 │ reference (cultivar_id)
                 ↓
┌──────────────────────────────────┐
│             TENANT               │
│ organization · fields            │
│ plantings · observations         │
│ harvests · inventory (пізніше)   │
│ version запису: 1 → 2 → 3 → 4    │
└────────────────┬─────────────────┘
                 │ local cache
                 ↓
┌──────────────────────────────────┐
│             DEVICE               │
│ IndexedDB / Dexie                │
│ cached KB · cached tenant        │
│ outbox · device_id · cursor      │
└──────────────────────────────────┘
```

TanStack Query — це не база: fetch/cache/refetch. Локальна правда — Dexie. Після синку джерело правди — PostgreSQL.

## GLOBAL KNOWLEDGE

Каталог **один на всю систему**. `Solanum lycopersicum` не копіюється в господарства.

Зміни каталогу пишуться в `kb_change` з монотонною **revision**. Телефон каже «у мене 125» — сервер віддає 126…131, не весь довідник.

`GET /api/sync/pull?kbRevision=125` → `{ kb: { revision, changes } }`.

## TENANT

Господарство = Better Auth `organization`. Farm-запис:

| поле | сенс |
| --- | --- |
| `id` | uuid, генерує клієнт (офлайн-create) |
| `created_at` / `updated_at` / `deleted_at` | soft delete |
| `version` | версія **цього** рядка: 1 → 2 → 3 → 4 |

`sync_status` (`pending \| synced \| failed \| conflict`) живе лише на пристрої.

Мультитенантність зараз: `organization_id` + сесія. Postgres RLS — пізніше.

## DEVICE

```
device (Postgres)
  id            uuid клієнта
  user_id
  name
  last_seen_at

outbox (Dexie)
  id
  device_id
  entity
  entity_id
  operation
  expected_version
  payload
  created_at
  attempts
```

Сервер зберігає `sync_receipt (device_id, item_id)`. Повтор того самого batch не створює дублікатів.

## Конфлікти (optimistic concurrency)

Два телефони з `version = 4`. Обидва змінюють → хочуть `5`.

```
UPDATE field
SET …, version = :expectedVersion + 1
WHERE id = :id
  AND organization_id = :org
  AND version = :expectedVersion
```

0 рядків → **conflict**, у відповіді поточний серверний запис. Клієнт мержить, ставить `expectedVersion` з сервера і шле знову.

Створення: `expectedVersion = 0`, insert `version = 1`.

## Курсор pull (не timestamp)

`GET /api/sync/pull?cursor=…&kbRevision=125&deviceId=…`

```json
{
  "kb": { "revision": 131, "changes": [] },
  "changes": [],
  "nextCursor": "xyz789",
  "hasMore": false
}
```

Tenant-потік — таблиця `farm_change` (`seq`). Курсор непрозорий (`base64url` від `{ seq }`). Точність годинника клієнта не бере участі.

`POST /api/sync/push` — `{ deviceId, deviceName, items }`. Відповідь: `accepted`, `duplicates`, `conflicts`.

## Шари на клієнті

Потік запису (наступний зріз): UI → Dexie + outbox → `online` → push (OCC + receipts) → pull (курсор + KB revision).

Service Worker кешує GET оболонки. Background Sync API — коли сторінка закрита в полі.

## Auth

Better Auth, email/password, хеш у `account`. Cookie `ogorod.session_token`. Organization = господарство. OAuth і реальна пошта — пізніше.

## Інфраструктура

Compose: Postgres 16, Redis, MinIO (Redis/MinIO зарезервовані). `.env` не комітити — лише `.env.example`.

```bash
cp .env.example .env
docker compose up -d postgres redis minio
npm run db:migrate
npm run db:seed
npm run dev
```

`src/proxy.ts` поруч із `src/app`. CI: `lint` + `typecheck` + `build`.
