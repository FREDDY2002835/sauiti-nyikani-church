import express from "express";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/membersController.js";

const router = express.Router();

router.get("/", getMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
