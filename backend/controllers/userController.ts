import { Response } from "express";
import { IUserInfoRequest } from "../middleware/authMiddleware";
import asyncHandler from "express-async-handler";

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(
    async (req: IUserInfoRequest, res: Response) => {
        res.status(200).json(req.user);
    }
);
