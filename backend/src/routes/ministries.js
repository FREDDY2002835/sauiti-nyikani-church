import express from "express";
import {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} from "../controllers/ministriesController.js";
import {
  getMembers, addMember, deleteMember,
  getActivities, addActivity, deleteActivity,
  getPlans, addPlan, deletePlan,
} from "../controllers/ministryDetailsController.js";

const router = express.Router();

router.get("/", getMinistries);
router.get("/:id", getMinistryById);
router.post("/", createMinistry);
router.put("/:id", updateMinistry);
router.delete("/:id", deleteMinistry);

router.get("/:id/members", getMembers);
router.post("/:id/members", addMember);
router.delete("/members/:memberId", deleteMember);

router.get("/:id/activities", getActivities);
router.post("/:id/activities", addActivity);
router.delete("/activities/:activityId", deleteActivity);

router.get("/:id/plans", getPlans);
router.post("/:id/plans", addPlan);
router.delete("/plans/:planId", deletePlan);

export default router;
