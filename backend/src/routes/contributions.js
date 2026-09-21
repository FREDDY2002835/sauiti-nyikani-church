import express from "express";
import {
  getContributions,
  createContribution,
  toggleContributionFulfilled,
  deleteContribution,
  getProjects,
  createProject,
  deleteProject,
} from "../controllers/contributionsController.js";

const router = express.Router();

router.get("/", getContributions);
router.post("/", createContribution);
router.put("/:id/fulfill", toggleContributionFulfilled);
router.delete("/:id", deleteContribution);

router.get("/projects", getProjects);
router.post("/projects", createProject);
router.delete("/projects/:id", deleteProject);

export default router;
