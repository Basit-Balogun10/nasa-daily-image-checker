import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/userModel";
import { GoogleAuthService } from "../services/authServices";
import { UserService } from "../services/userServices";

import { generateToken, generateRandomCharacters } from "../utils";
import { encryptData, decryptData, decryptState } from "../utils";

// @desc    Register new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    // Check if user exists
    if (await UserService.getUser(email)) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserService.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    if (user) {
        const token = generateToken(user);

        const resData = {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const cookieOptions = {
            maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
            secure: true,
            httpOnly: true,
            sameSite: "lax" as const,
        };

        res.cookie("NDIC_token", token, cookieOptions);
        res.status(201).json(resData);
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await UserService.getUser(email);

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user);

        const resData = {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const cookieOptions = {
            maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
            secure: true,
            httpOnly: true,
            sameSite: "lax" as const,
        };

        res.cookie("NDIC_token", token, cookieOptions);
        res.json(resData);
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

// @desc Signup or Login with Google
// @route GET /api/v1/auth/google
// @access Public
export const authenticateWithGoogle = asyncHandler(async (req, res) => {
    const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    const GOOGLE_AUTH_SCOPE = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const REDIRECT_URI = "api/v1/auth/google";
    const LOGIN_URL = `${process.env.BASE_FRONTEND_URL}/login`;
    const BACKEND_DOMAIN = process.env.BASE_BACKEND_URL;

    if (req.query.obtainAuthUrl) {
        let state = generateRandomCharacters(20);
        if (req.query.isSignup) {
            state += ',{"isSignup": true}';
        }

        const encryptedState = encryptData(state);
        const googleAuthUrlParams = {
            response_type: "code",
            client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID
                ? process.env.GOOGLE_OAUTH2_CLIENT_ID
                : "",
            redirect_uri: `http://localhost:8000/${REDIRECT_URI}`,
            prompt: "select_account",
            access_type: "offline",
            scope: GOOGLE_AUTH_SCOPE.join(" "),
            state: encryptedState,
        };
        const cookieOptions = {
            maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
            secure: true,
            httpOnly: true,
            sameSite: "none" as const,
        };
        const response_data = {
            googleAuthUrl: `${GOOGLE_AUTH_URL}?${new URLSearchParams(
                googleAuthUrlParams
            ).toString()}`,
        };

        res.cookie("NDIC_state_param", encryptedState, cookieOptions);
        res.status(200).json(response_data);
    } else {
        const stateFromRequest = req.query.state as string;
        const stateFromCookies = req.cookies["NDIC_state_param"] as string;

        if (stateFromCookies === stateFromRequest) {
            const { isSignup } = decryptState(stateFromCookies);
            const { code, error } = req.query;

            if (error || !code) {
                const urlParams = { error: error as string };
                res.redirect(
                    `${LOGIN_URL}?${new URLSearchParams(urlParams).toString()}`
                );
            }

            // Consider reversing url name instead of hardcoding REDIRECT_URI down here
            const { accessToken, refreshToken } = GoogleAuthService.getTokens(code as string, `${BACKEND_DOMAIN}/${REDIRECT_URI}`)
            GoogleAuthService.validateAccessToken(accessToken)
            
            const userData = GoogleAuthService.getUserInfo(accessToken)
            const firstName = userData.given_name;
            const lastName = userData.family_name || "";

            const userProfileData: Omit<IUser, "createdAt" | "updatedAt"> = {
                email: userData.email,
                firstName,
                googlePictureUrl: userData.picture || "",
                googleRefreshToken: refreshToken,
                lastName,
                password: ""
            }

            let user = await UserService.getUser(userData.email);

            if (!user) {
                user = await UserService.createUser(userProfileData);
            }
            const token = generateToken(user!);

            const resData = {
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };

            const cookieOptions = {
                maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
                secure: true,
                httpOnly: true,
                sameSite: "lax" as const,
            };

            res.cookie("NDIC_token", token, cookieOptions);
            res.json(resData);

        } else {
            throw new Error("State parameter mismatch");
        }
    }
});
