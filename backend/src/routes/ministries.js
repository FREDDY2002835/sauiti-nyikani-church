import express from "express";
import {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} from "../controllers/ministriesController.js";

const router = express.Router();

router.get("/", getMinistries);
router.get("/:id", getMinistryById);
router.post("/", createMinistry);
router.put("/:id", updateMinistry);
router.delete("/:id", deleteMinistry);

export default router;
