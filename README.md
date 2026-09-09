# OGOROD

Offline-first PWA для городу. Три шари даних: глобальний каталог рослин (KB), господарство (tenant), пристрій (Dexie + outbox).

Поточний зріз — **фундамент**: PostgreSQL + Drizzle, Better Auth, Dexie/черга синку з OCC і курсором, Docker. UI спостережень ще немає.

Деталі: [docs/architecture.md](docs/architecture.md).

## Швидкий старт (розробка)

Потрібні Docker і Node 22+.

```bash
git clone <repo>
cd ogorod
cp .env.example .env
```

У `.env` задайте `BETTER_AUTH_SECRET` (наприклад `openssl rand -base64 32`). Не комітьте цей файл.

```bash
docker compose up -d postgres redis minio
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000), зареєструйте акаунт. Після signup створюється господарство «Мій город».

Seed KB додає один таксон: `Solanum lycopersicum` / Помідор, сорт «Бичаче серце» — один раз на всю систему, не на користувача.

## Self-host

Той самий репозиторій і образ. Спочатку Postgres, міграції й seed, потім увесь стек:

```bash
cp .env.example .env
# заповніть BETTER_AUTH_SECRET та інші секрети
docker compose up -d postgres redis minio
npm run db:migrate
npm run db:seed
docker compose --profile full up -d
```

Піднімаються Postgres, Redis, MinIO і застосунок. Caddy / TLS на ваш reverse proxy.

## Скрипти

| Команда | Що робить |
| --- | --- |
| `npm run dev` | Next.js |
| `npm run db:up` | Postgres у Docker |
| `npm run db:generate` | нові SQL-міграції з Drizzle-схеми |
| `npm run db:migrate` | застосувати міграції |
| `npm run db:seed` | KB-seed (томат) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |

## Секрети

У GitHub немає реальних паролів. Шаблон змінних — `.env.example`. `.env` у `.gitignore`.
