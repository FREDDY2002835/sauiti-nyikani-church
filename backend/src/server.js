// This is the entry point of the whole backend.
// Running "npm start" or "npm run dev" starts THIS file.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initDb } from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import prayerRoutes from "./routes/prayer.js";
import ministriesRoutes from "./routes/ministries.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// These run on EVERY request, before it reaches any route.

// Allows your frontend (running on a different port/domain) to call this API.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Lets Express understand JSON data sent in a request body (req.body).
app.use(express.json());

// --- Routes ---
// Any request to /api/contact gets handled by contactRoutes,
// any request to /api/prayer gets handled by prayerRoutes.
app.use("/api/contact", contactRoutes);
app.use("/api/prayer", prayerRoutes);
app.use("/api/ministries", ministriesRoutes);

// Simple health check - visiting this URL confirms the server is alive.
app.get("/", (req, res) => {
  res.json({ status: "Sauti Nyikani backend is running." });
});

// --- Start the server ---
const start = async () => {
  try {
    await initDb(); // make sure our tables exist before accepting requests
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
