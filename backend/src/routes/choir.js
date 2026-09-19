import express from "express";
import {
  getChoirGroups,
  createChoirGroup,
  deleteChoirGroup,
  getChoirMembers,
  createChoirMember,
  deleteChoirMember,
  getSessions,
  createSession,
  deleteSession,
  getAttendance,
  addAttendance,
  removeAttendance,
} from "../controllers/choirController.js";

const router = express.Router();

router.get("/groups", getChoirGroups);
router.post("/groups", createChoirGroup);
router.delete("/groups/:id", deleteChoirGroup);

router.get("/members", getChoirMembers);
router.post("/members", createChoirMember);
router.delete("/members/:id", deleteChoirMember);

router.get("/sessions", getSessions);
router.post("/sessions", createSession);
router.delete("/sessions/:id", deleteSession);

router.get("/sessions/:id/attendance", getAttendance);
router.post("/sessions/:id/attendance", addAttendance);
router.delete("/attendance/:id", removeAttendance);

export default router;
