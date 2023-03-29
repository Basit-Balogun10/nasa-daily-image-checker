import express from "express";
import {getTodayImage} from "../controllers/imageController";
import { protect } from '../middleware/authMiddleware'

const router = express.Router();

router.get('/', protect, getTodayImage)

module.exports = router;