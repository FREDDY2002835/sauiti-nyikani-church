# Sauti Nyikani Church — Final Release

This release contains the public church website, protected management application, and Node.js/PostgreSQL backend.

## Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Create `Frontend/.env` from `.env.example` if needed. For local development, leaving `VITE_API_URL` empty makes the app use the current browser host on port 5000 automatically. You can also set:

```env
VITE_API_URL=http://localhost:5000/api
```

For another device on the same Wi-Fi, use the computer's LAN address, for example:

```env
VITE_API_URL=http://192.168.0.120:5000/api
```

## Backend

```powershell
cd backend
npm install
```

Create `backend/.env` from `.env.example` and configure your real PostgreSQL and email values plus:

```env
PORT=5000
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=long-random-secret
```

Start the backend:

```powershell
npm run dev
```

Health check:

`http://localhost:5000`

## Public website

The public site is available from the normal routes such as `/`, `/about`, `/ministries`, `/sermons`, `/events`, `/gallery`, `/giving`, `/prayer`, and `/contact`.

## Management app

Admin login: `/admin/login`

Management dashboard: `/admin/manage`

Management routes are protected by admin authentication. Public visitors do not get management controls simply by browsing the public pages.

## Important security note

The real `.env` files are intentionally NOT included in the final release ZIPs. Never commit database passwords, email passwords, admin passwords, or JWT secrets to GitHub.
