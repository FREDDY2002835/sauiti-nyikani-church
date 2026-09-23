import express from "express";
import { loginAdmin, requireAuth } from "../auth/auth.js";

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

export default router;
