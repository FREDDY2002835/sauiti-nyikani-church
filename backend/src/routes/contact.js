// This file says: "when a POST request comes in to /api/contact,
// hand it off to the submitContact function."

import express from "express";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContact);

export default router;
