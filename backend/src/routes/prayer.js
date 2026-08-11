import express from "express";
import { submitPrayer } from "../controllers/prayerController.js";

const router = express.Router();

router.post("/", submitPrayer);

export default router;
