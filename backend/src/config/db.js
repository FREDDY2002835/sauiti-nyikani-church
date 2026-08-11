// This file sets up ONE shared connection to the PostgreSQL database.
// Every other file that needs to talk to the database imports "pool" from here,
// instead of each opening its own separate connection.

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Most hosted Postgres providers (Render, Railway, Neon, Supabase) require SSL.
  // If you're running Postgres on your own machine locally, you can remove this.
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// This function makes sure the tables we need actually exist.
// It's safe to run every time the server starts - "IF NOT EXISTS" means
// it won't wipe out data that's already there.
export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS prayer_requests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      request TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("Database tables ready.");
};
