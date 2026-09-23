// This is the entry point of the whole backend.
// Running "npm start" or "npm run dev" starts THIS file.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initDb } from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import prayerRoutes from "./routes/prayer.js";
import ministriesRoutes from "./routes/ministries.js";
import sermonsRoutes from "./routes/sermons.js";
import eventsRoutes from "./routes/events.js";
import galleryRoutes from "./routes/gallery.js";
import membersRoutes from "./routes/members.js";
import communionRoutes from "./routes/communion.js";
import choirRoutes from "./routes/choir.js";
import tithesRoutes from "./routes/tithes.js";
import eldersRoutes from "./routes/elders.js";
import financeRoutes from "./routes/finance.js";
import baptismRoutes from "./routes/baptisms.js";
import contributionsRoutes from "./routes/contributions.js";
import announcementsRoutes from "./routes/announcements.js";
import authRoutes from "./routes/auth.js";
import { requireAuth } from "./auth/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// These run on EVERY request, before it reaches any route.

// Allows your frontend (running on a different port/domain) to call this API.
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedLocalOrigin = (origin) => {
  if (!origin) return true; // non-browser requests such as curl/Postman
  try {
    const url = new URL(origin);
    const host = url.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    const isPrivateIPv4 = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host);
    return isLocalHost || isPrivateIPv4;
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (configuredOrigins.length > 0) {
        return callback(null, !origin || configuredOrigins.includes(origin) || isAllowedLocalOrigin(origin));
      }
      return callback(null, isAllowedLocalOrigin(origin));
    },
  })
);

// Lets Express understand JSON data sent in a request body (req.body).
app.use(express.json());

// --- Routes ---
// Any request to /api/contact gets handled by contactRoutes,
// any request to /api/prayer gets handled by prayerRoutes.
app.use("/api/auth", authRoutes);

// Public forms stay public. All other non-GET API operations require admin authentication.
app.use("/api", (req, res, next) => {
  if (req.path === "/auth/login" && req.method === "POST") return next();
  if (req.path.startsWith("/contact") || req.path.startsWith("/prayer")) return next();

  // Public content can be read without an account. Private church-management
  // records require authentication even for GET requests.
  const privateReadPaths = ["/members", "/communion", "/choir", "/tithes", "/elders", "/finance", "/baptisms", "/contributions"];
  const isPublicProjectRead = req.method === "GET" && req.path === "/contributions/projects";
  const isPrivateRead = !isPublicProjectRead && req.method === "GET" && privateReadPaths.some((path) => req.path === path || req.path.startsWith(`${path}/`));
  if (req.method === "GET" && !isPrivateRead) return next();

  return requireAuth(req, res, next);
});

app.use("/api/contact", contactRoutes);
app.use("/api/prayer", prayerRoutes);
app.use("/api/ministries", ministriesRoutes);
app.use("/api/sermons", sermonsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/communion", communionRoutes);
app.use("/api/choir", choirRoutes);
app.use("/api/tithes", tithesRoutes);
app.use("/api/elders", eldersRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/baptisms", baptismRoutes);
app.use("/api/contributions", contributionsRoutes);
app.use("/api/announcements", announcementsRoutes);

// Uploaded photos live on disk in /uploads - this makes them reachable
// at http://localhost:5000/uploads/whatever-the-filename-is.jpg
app.use("/uploads", express.static("uploads"));

// Simple health check - visiting this URL confirms the server is alive.
app.get("/", (req, res) => {
  res.json({ status: "Sauti Nyikani backend is running." });
});

// --- Start the server ---
const start = async () => {
  try {
    await initDb(); // make sure our tables exist before accepting requests
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
