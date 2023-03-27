import express, { Router } from "express";

import { getMe } from '../controllers/userController'
import { protect } from '../middleware/authMiddleware'

export const router = Router();
router.get('/me', protect, getMe)
