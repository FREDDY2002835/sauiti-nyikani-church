import express from "express";
import { loginAdmin, requireAuth, unlockSections, SECTION_TOKEN_TTL_SECONDS } from "../auth/auth.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  try {
    const token = loginAdmin(email, password);
    res.json({ token, user: { email: process.env.ADMIN_EMAIL, role: "admin" } });
  } catch (error) {
    const status = error.message.includes("not configured") ? 500 : 401;
    res.status(status).json({ error: error.message });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.admin });
});

// Second password, for the Tithes, Elders Council and Finance sections.
// The person must already be logged in as admin.
router.post("/unlock", requireAuth, (req, res) => {
  try {
    const token = unlockSections((req.body || {}).password, req.admin.email);
    res.json({ token, expiresInSeconds: SECTION_TOKEN_TTL_SECONDS });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;