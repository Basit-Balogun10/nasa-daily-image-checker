import express, { Router } from "express";
import {
  authenticateWithGoogle,
  loginUser,
  registerUser,
} from "../controllers/authController";

export const router = Router();

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post("/google", authenticateWithGoogle);