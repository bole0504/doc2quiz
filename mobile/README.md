# doc2quiz Mobile (Expo)

Learner app for iOS and Android. Uses the same API as web `/quiz`.

## Setup

```bash
# From repo root
npm install

cd mobile
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your Next.js server (use LAN IP for physical devices)
```

## Run

```bash
# Terminal 1: web API
cd web && npm run dev

# Terminal 2: Expo
cd mobile && npm start
```

Default seed user: `user@example.com` / `user123` (see `web/.env`).
