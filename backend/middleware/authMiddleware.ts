import { Request, Response, NextFunction, } from "express";
import type { IUser } from "../models/userModel"

import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

export interface IUserInfoRequest extends Request {
    user?: IUser;
}

export const protect = asyncHandler(async (req: IUserInfoRequest,
    res: Response,
    next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, (process.env.JWT_SECRET) as string);

            req.user = (await User.findById((decoded as JwtPayload).id).select("-password")) as (undefined | IUser);

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not authorized");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});