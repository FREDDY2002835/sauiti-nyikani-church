# Sauti Nyikani Management App

The same React project contains the public church website and a protected management area.

- Public pages: `/`, `/sermons`, `/events`, `/gallery`, etc.
- Admin login: `/admin/login`
- Admin dashboard: `/admin/manage`

The management area is installable as a PWA on supported mobile and desktop browsers. Its manifest is loaded only after entering the protected admin area.

Set `VITE_API_URL` to the backend API base, for example:

```env
VITE_API_URL=http://localhost:5000/api
```
