import express from "express";
import {
  getTithes,
  createTithe,
  deleteTithe,
} from "../controllers/tithesController.js";

const router = express.Router();

router.get("/", getTithes);
router.post("/", createTithe);
router.delete("/:id", deleteTithe);

export default router;
