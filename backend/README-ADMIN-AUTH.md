# Sauti Nyikani Church — Public + Management architecture

The backend now supports two clients using the same API and PostgreSQL database:

- Public church website: reads public content and submits Contact/Prayer forms.
- Private management application: signs in at `/admin/login` and manages church data.

## Required environment variables

Set these in the backend `.env` (never commit the real `.env`):

```env
PORT=5000
DATABASE_URL=your-postgresql-connection-string
EMAIL_USER=your-church-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=your-church-email@gmail.com
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-private-password
JWT_SECRET=use-a-long-random-secret
```

The admin password is only used to issue a signed token; the token is then required for management API operations. Change the credentials before production deployment.

## Public vs private API

Public GET endpoints include sermons, events, gallery, ministries, announcements and project progress. Contact and Prayer submissions remain public.

Management operations and private church records require `Authorization: Bearer <token>`.
