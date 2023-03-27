import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUser } from "../models/userModel";

interface tokenPayload {
    id: mongoose.Types.ObjectId;
    email: string;
    iat: number;
    exp: number
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
        exp: issuedAt + 7 * 24 * 60 * 60 * 1000, //Token expires in 7 days
    };

    return jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
    });
};

export const generateRandomCharacters = (length: number) => {
    return crypto.randomBytes(length).toString('hex');
}