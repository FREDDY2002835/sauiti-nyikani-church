import express from "express";
import {
  getBaptisms,
  createBaptism,
  deleteBaptism,
} from "../controllers/baptismController.js";

const router = express.Router();

router.get("/", getBaptisms);
router.post("/", createBaptism);
router.delete("/:id", deleteBaptism);

export default router;
