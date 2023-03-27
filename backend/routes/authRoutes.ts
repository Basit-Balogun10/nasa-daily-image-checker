import express from "express";
import {
  authenticateWithGoogle,
  loginUser,
  registerUser,
} from "../controllers/authController";

const router = express.Router();

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post("/google", authenticateWithGoogle);

module.exports = router;