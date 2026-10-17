# Finances

Personal expense tracker experimenting with Material Design 3 for learning purposes

React, TypeScript, Vite, shadcn, tailwind

<img width=500 alt="Screenshot_20260102-214207" src="https://github.com/user-attachments/assets/c0a482fd-b65a-444c-b9c1-1fdc6219dbda" />

## Self-hosting with Docker

Pre-built images are published automatically to GHCR on every release: `ghcr.io/jgoedde/finances`. One container serves both the app and its API; all data lives in a single SQLite database under `/data`.

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

Put a TLS-terminating reverse proxy in front of it. Session cookies are only marked `Secure` when `BASE_URL` uses `https`.

Pin to a specific version instead of `latest` if you want reproducible deploys, e.g. `ghcr.io/jgoedde/finances:2.0.0`.

### Users

There is no public sign-up. Create links with the CLI inside the container and send them to people. Each link works once; invites expire after 7 days, password reset links after 24 hours.

```bash
docker compose exec finances finances invite
docker compose exec finances finances reset-password <username>
docker compose exec finances finances users
```

### Build from source

```bash
docker build -t finances .
```
