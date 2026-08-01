# Finances

Personal expense tracker experimenting with Material Design 3 for learning purposes

React, TypeScript, Vite, shadcn, tailwind

<img width=500 alt="Screenshot_20260102-214207" src="https://github.com/user-attachments/assets/c0a482fd-b65a-444c-b9c1-1fdc6219dbda" />

## Self-hosting with Docker Compose

This repository includes a production Dockerfile and a simple `docker-compose.yml` that builds the app and serves it with nginx.

Build and run (from project root):

```bash
docker compose build --pull
docker compose up -d
```

The frontend will be available at http://localhost (or whatever host/port you mapped in `docker-compose.yml`).

Notes:

- The Dockerfile performs a production build (`npm run build`) and serves the `dist` output with nginx.
- The provided nginx config includes an SPA fallback so client-side routes work
