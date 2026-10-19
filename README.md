<h1>Finances</h1>

Personal expense tracker experimenting with Material Design 3 for learning purposes

React, TypeScript, Vite, shadcn, tailwind

<h2>Contents</h2>

<!-- TOC -->

- [Self-hosting with Docker](#self-hosting-with-docker)
    - [Users](#users)
    - [Backup and restore](#backup-and-restore)
    - [Build from source](#build-from-source)
- [Configuration](#configuration)

<!-- TOC -->

## Self-hosting with Docker

Pre-built images are published automatically to GHCR on every release: `ghcr.io/jgoedde/finances`. One container serves
both the app and its API; all data lives in a single SQLite database under `/data`. See [Configuration](#configuration)
for the environment variables.

```yaml
services:
    finances:
        image: ghcr.io/jgoedde/finances:latest
        ports:
            - "3000:3000"
        environment:
            # Public URL the app is reached at. Sign-in only works from this origin.
            BASE_URL: https://finances.example.com
            # Generate with: openssl rand -base64 32
            BETTER_AUTH_SECRET: change-me
            # Creates the first admin on the first start (when no users exist).
            ADMIN_USERNAME: admin
            ADMIN_PASSWORD: change-me-too
            # Optional, comma-separated extra origins allowed to sign in.
            # TRUSTED_ORIGINS: http://192.168.1.10:3000
            # Optional: trace, debug, info (default), warn, error, fatal or silent.
            # LOG_LEVEL: info
        volumes:
            - ./data:/data
        restart: unless-stopped
```

The data directory must be writable by the container user (uid 1000): `mkdir data && sudo chown 1000:1000 data`.

Put a TLS-terminating reverse proxy in front of it.

Pin to a specific version instead of `latest` if you want reproducible deploys, e.g. `ghcr.io/jgoedde/finances:2.0.0`.

### Users

There is no public sign-up. Create links with the CLI inside the container and send them to people. Each link works
once; invites expire after 7 days, password reset links after 24 hours.

```bash
docker compose exec finances finances invite
docker compose exec finances finances reset-password <username>
docker compose exec finances finances users
```

### Backup and restore

`finances backup` writes a consistent snapshot of the whole database (all users, accounts and data) to stdout. It is
safe while the server is running. `-T` keeps Docker from mangling the binary output:

```bash
docker compose exec -T finances finances backup > finances-$(date +%F).db
```

`finances restore` reads a snapshot from stdin and replaces the whole database. It only runs on an empty instance (no
transactions or fixed costs yet). To replace an instance that has data, stop the server first and pass `--force`:

```bash
docker compose stop finances
docker compose run --rm -T finances finances restore --force < backup.db
docker compose start finances
```

To move to a new machine:

1. Take a backup on the old machine (see above).
2. On the new machine, set up `compose.yaml` and the data directory as described above. Keep the same
   `BETTER_AUTH_SECRET`, otherwise everyone has to sign in again.
3. Restore before the first start, then start the server. It applies any pending migrations on startup.

```bash
docker compose run --rm -T finances finances restore < backup.db
docker compose up -d
```

### Build from source

```bash
docker build -t finances .
```

## Configuration

In Docker, set the variables under `environment` in `compose.yaml`; for development, copy `apps/api/.env.example` to
`apps/api/.env`.

| Variable                            | Required | Default             | Description                                                                                                                                                                   |
| ----------------------------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BASE_URL`                          | Yes      |                     | Public URL of the app. Sign-in only works from this origin, and `https` turns on `Secure` session cookies. In development it's `http://localhost:5173` (the Vite dev server). |
| `BETTER_AUTH_SECRET`                | Yes      |                     | Generate it with `openssl rand -base64 32`. Changing it signs everyone out, so keep it when moving to a new machine.                                                          |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | No       |                     | Create the first admin (set both). They are only read on a start with zero users and ignored after that, so you can remove them once the admin exists.                        |
| `TRUSTED_ORIGINS`                   | No       |                     | Comma-separated list of extra origins allowed to sign in, e.g. for `npm run dev:host` on a phone.                                                                             |
| `LOG_LEVEL`                         | No       | `info`              | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`.                                                                                                          |
| `PORT`                              | No       | `3000`              | Port the server listens on. If you change it, change the compose port mapping too.                                                                                            |
| `DATABASE_PATH`                     | No       | `/data/finances.db` | Path of the SQLite database. In Docker it must be inside the mounted volume.                                                                                                  |
