import express from "express";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  updateTestimony,
} from "../controllers/membersController.js";

const router = express.Router();

router.get("/", getMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);
router.put("/:id/testimony", updateTestimony);

export default router;
