import express from "express";
import {
  getElders, createElder, deleteElder,
  getMeetings, createMeeting, deleteMeeting, updateMeetingMinutes,
  getAttendance, addAttendance, removeAttendance,
  getPlans, addPlan, deletePlan,
} from "../controllers/eldersController.js";

const router = express.Router();

router.get("/", getElders);
router.post("/", createElder);
router.delete("/:id", deleteElder);

router.get("/meetings", getMeetings);
router.post("/meetings", createMeeting);
router.delete("/meetings/:id", deleteMeeting);
router.put("/meetings/:id/minutes", updateMeetingMinutes);

router.get("/meetings/:id/attendance", getAttendance);
router.post("/meetings/:id/attendance", addAttendance);
router.delete("/attendance/:id", removeAttendance);

router.get("/plans", getPlans);
router.post("/plans", addPlan);
router.delete("/plans/:id", deletePlan);

export default router;
