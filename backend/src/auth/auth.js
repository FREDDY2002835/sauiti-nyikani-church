import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

// How long the Tithes / Elders / Finance sections stay unlocked after the
// extra password is entered (the person must type it again after this).
export const SECTION_TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

const base64url = (value) => Buffer.from(value).toString("base64url");

const sign = (header, payload) => {
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
};

const verify = (token) => {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("Invalid token");

  const [header, payload, signature] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(`${header}.${payload}`).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("Invalid token");

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");
  return decoded;
};

export const createAdminToken = (email) => {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    { alg: "HS256", typ: "JWT" },
    { sub: "admin", email, role: "admin", iat: now, exp: now + TOKEN_TTL_SECONDS }
  );
};

export const loginAdmin = (email, password) => {
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredEmail || !configuredPassword) {
    throw new Error("Admin credentials are not configured on the server.");
  }

  const emailMatches = String(email || "").trim().toLowerCase() === configuredEmail.trim().toLowerCase();
  const passwordMatches = String(password || "") === configuredPassword;
  if (!emailMatches || !passwordMatches) throw new Error("Invalid email or password.");

  return createAdminToken(configuredEmail.trim());
};

export const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

  try {
    const decoded = verify(token);
    // Only a real admin login token is accepted here. (The short-lived
    // "section" token below must never work as a login token.)
    if (decoded.role !== "admin") throw new Error("Not an admin token");
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Authentication required." });
  }
};

// ---------------------------------------------------------------------------
// Extra password for the private sections (Tithes, Elders Council, Finance)
// ---------------------------------------------------------------------------

const createSectionToken = (email) => {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    { alg: "HS256", typ: "JWT" },
    { sub: "sections", email, role: "section", scope: "private-sections", iat: now, exp: now + SECTION_TOKEN_TTL_SECONDS }
  );
};

// Compare two passwords safely (always the same time, whatever they contain).
const hash = (value) => crypto.createHash("sha256").update(String(value || "")).digest();

// Protection against guessing: after 5 wrong tries the section stays locked
// for 15 minutes. (Kept in memory - it resets if the server restarts.)
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map();

export const unlockSections = (password, key) => {
  const configured = process.env.PRIVATE_SECTIONS_PASSWORD;
  if (!configured) {
    const error = new Error("The private sections password is not configured on the server.");
    error.status = 500;
    throw error;
  }

  const now = Date.now();
  const entry = attempts.get(key) || { count: 0, lockedUntil: 0 };

  if (entry.lockedUntil > now) {
    const minutes = Math.ceil((entry.lockedUntil - now) / 60000);
    const error = new Error(`Too many wrong attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
    error.status = 429;
    throw error;
  }

  if (!crypto.timingSafeEqual(hash(password), hash(configured))) {
    entry.count += 1;
    if (entry.count >= MAX_ATTEMPTS) {
      entry.count = 0;
      entry.lockedUntil = now + LOCK_MS;
    }
    attempts.set(key, entry);
    const error = new Error("Wrong password.");
    error.status = 401;
    throw error;
  }

  attempts.delete(key);
  return createSectionToken(key);
};

// Put this in front of any route that must stay locked. It runs AFTER the
// normal admin login check, and also needs the unlock token.
export const requireSectionAccess = (req, res, next) => {
  const token = req.headers["x-section-token"] || "";

  try {
    const decoded = verify(token);
    if (decoded.scope !== "private-sections") throw new Error("Wrong token type");
    if (req.admin && decoded.email !== req.admin.email) throw new Error("Token belongs to someone else");
    next();
  } catch {
    res.status(403).json({
      error: "This section is locked. Enter the section password.",
      code: "SECTION_LOCKED",
    });
  }
};
