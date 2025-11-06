import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.put("/update", verifyToken, updateUserProfile);

export default router;
