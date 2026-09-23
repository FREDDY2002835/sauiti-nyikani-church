import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

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
    req.admin = verify(token);
    next();
  } catch {
    res.status(401).json({ error: "Authentication required." });
  }
};
