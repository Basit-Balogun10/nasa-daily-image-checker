import express from "express";
import {
  authenticateWithGoogle,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController";
import { protect } from '../middleware/authMiddleware'

const router = express.Router();

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.get('/logout', protect, logoutUser)
router.get("/google", authenticateWithGoogle);

module.exports = router;