// API configuration works in three situations:
// 1. VITE_API_URL is set (recommended for production/deployment).
// 2. Local development on this computer -> http://localhost:5000/api.
// 3. The frontend is opened from another device on the same LAN -> use that
//    device-visible hostname/IP on port 5000 automatically.
const configured = (import.meta.env.VITE_API_URL || "").trim();

const getDefaultApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000/api";
  const host = window.location.hostname || "localhost";
  return `${window.location.protocol === "https:" ? "https" : "http"}://${host}:5000/api`;
};

export const API_URL = (configured || getDefaultApiUrl()).replace(/\/$/, "");
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
