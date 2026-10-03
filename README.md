# Finances

Personal expense tracker experimenting with Material Design 3 for learning purposes

React, TypeScript, Vite, shadcn, tailwind

<img width=500 alt="Screenshot_20260102-214207" src="https://github.com/user-attachments/assets/c0a482fd-b65a-444c-b9c1-1fdc6219dbda" />

## Self-hosting with Docker

Pre-built images are published automatically to GHCR on every release: `ghcr.io/jgoedde/finances`.

### Option A: Use the prebuilt image (recommended)

```bash
docker run -d \
  --name finances \
  -p 80:80 \
  --restart unless-stopped \
  ghcr.io/jgoedde/finances:latest
```

Or with Docker Compose:

```yaml
services:
    finances:
        image: ghcr.io/jgoedde/finances:latest
        ports:
            - "80:80"
        volumes:
            # optional: the in-app "Backup" button writes the database here
            - ./backups:/backups
        restart: unless-stopped
```

The backup directory must be writable by nginx (uid 101): `mkdir backups && sudo chown 101:101 backups`.
Without the mount, the "Backup" button falls back to downloading the file in the browser.

Pin to a specific version instead of `latest` if you want reproducible deploys, e.g. `ghcr.io/jgoedde/finances:1.5.0`.

### Option B: Build from source

```bash
docker build -t finances-client .
docker run -d -p 80:80 --restart unless-stopped finances-client
```

The frontend will be available at http://localhost (or whatever host/port you mapped).

Notes:

- `Dockerfile` performs a production build (`npm run build`) and serves the `dist` output with nginx.
- The provided nginx config includes an SPA fallback so client-side routes work.
