import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUser } from "../models/userModel";

interface tokenPayload {
    id: mongoose.Types.ObjectId;
    email: string;
    iat: number;
}

interface User extends IUser {
    _id: mongoose.Types.ObjectId;
}

export const generateToken = (user: User) => {
    const issuedAt = new Date().getTime();

    const tokenPayload: tokenPayload = {
        id: user._id,
        email: user.email,
        iat: issuedAt,
    };

    return jwt.sign(tokenPayload, (process.env.JWT_SECRET as string), {
        expiresIn: "7d",
    });
};

export const generateRandomCharacters = (length: number) => {
    return crypto.randomBytes(length).toString('hex');
}