import express from "express";
import {
  getSessions,
  createSession,
  deleteSession,
  getAttendance,
  addAttendance,
  removeAttendance,
} from "../controllers/communionController.js";

const router = express.Router();

router.get("/sessions", getSessions);
router.post("/sessions", createSession);
router.delete("/sessions/:id", deleteSession);

router.get("/sessions/:id/attendance", getAttendance);
router.post("/sessions/:id/attendance", addAttendance);
router.delete("/attendance/:id", removeAttendance);

export default router;
