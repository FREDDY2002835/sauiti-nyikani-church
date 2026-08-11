# Sauiti Nyikani Church — Backend

A small Node.js/Express API that powers the Contact and Prayer Request forms
on the church website. It saves every submission to a PostgreSQL database
and emails the church office a copy.

## What's in here

```
backend/
├── src/
│   ├── server.js              # entry point - starts everything
│   ├── config/db.js           # database connection + table setup
│   ├── routes/
│   │   ├── contact.js         # POST /api/contact
│   │   └── prayer.js          # POST /api/prayer
│   ├── controllers/
│   │   ├── contactController.js
│   │   └── prayerController.js
│   └── utils/mailer.js        # email sending
├── .env.example                # template for secrets (copy to .env)
└── package.json
```

## Setup (first time only)

1. **Install dependencies**
   ```
   cd backend
   npm install
   ```

2. **Create a PostgreSQL database.** Easiest free options:
   - [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free Postgres, no credit card)
   - Or install Postgres locally if you prefer

   Either way, you'll end up with a connection string that looks like:
   ```
   postgresql://username:password@host:5432/database_name
   ```

3. **Set up your `.env` file**
   ```
   cp .env.example .env
   ```
   Then open `.env` and fill in:
   - `DATABASE_URL` — the connection string from step 2
   - `EMAIL_USER` / `EMAIL_PASS` — a Gmail address + an [App Password](https://myaccount.google.com/apppasswords) (not your normal Gmail password)
   - `EMAIL_TO` — where you want form submissions emailed to (can be the same as EMAIL_USER)

4. **Run it**
   ```
   npm run dev
   ```
   You should see:
   ```
   Database tables ready.
   Server running on http://localhost:5000
   ```

5. **Test it's working** — visit `http://localhost:5000` in your browser. You should see:
   ```json
   { "status": "Sauiti Nyikani backend is running." }
   ```

## API Endpoints

### `POST /api/contact`
Body (JSON):
```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "Hello!" }
```

### `POST /api/prayer`
Body (JSON):
```json
{ "name": "Jane Doe", "email": "jane@example.com", "request": "Please pray for..." }
```

Both return `{ "success": true, "id": 1 }` on success, or an error message
with a 400/500 status code on failure.

## Next step: connecting the frontend

The frontend's Contact.jsx and Prayer.jsx currently only update local state
when the form is submitted — they don't send anything anywhere yet. That's
the next piece of work: pointing those forms at these two endpoints.
