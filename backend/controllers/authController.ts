import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { IUserInfoRequest } from "../middleware/authMiddleware";
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
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 30 minutes in milliseconds
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
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 30 minutes in milliseconds
            secure: true,
            httpOnly: true,
            sameSite: "lax" as const,
        };

        res.cookie("NDIC_token", token, cookieOptions);
        res.status(200).json(resData);
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

// @desc    Log out a user
// @route   GET /api/v1/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: IUserInfoRequest, res) => {
    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "lax" as const,
    };

    res.clearCookie("NDIC_token", cookieOptions);
    res.status(204).json(req.user);
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
    const REDIRECT_URI = "api/v1/auth/google/";
    const BASE_FRONTEND_URL = process.env.NODE_ENV === "production" ? process.env.APP_LIVE_URL : process.env.BASE_FRONTEND_URL;
    const BACKEND_DOMAIN = process.env.NODE_ENV === "production" ? process.env.APP_LIVE_URL : process.env.BASE_BACKEND_URL;

    if (req.query.obtainAuthUrl) {
        let state = generateRandomCharacters(20);
        if (req.query.isSignup) {
            state += ',{"isSignup": true}';
        } else {
            state += ',{"isSignup": false}';
        }

        console.log("STATE", state);
        const encryptedState = encryptData(state);
        console.log("ENCRYPTED STATE", encryptedState);
        const googleAuthUrlParams = {
            response_type: "code",
            client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID as string,
            redirect_uri: `${BACKEND_DOMAIN}/${REDIRECT_URI}`,
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
            googleAuthUrl: `${GOOGLE_AUTH_URL}?${new URLSearchParams(googleAuthUrlParams).toString()}`,
        };

        res.cookie("NDIC_state_param", encryptedState, cookieOptions);
        res.status(200).json(response_data);
    } else {
        const stateFromRequest = req.query.state as string;
        const stateFromCookies = req.cookies["NDIC_state_param"] as string;
        console.log("REQUEST STATE", stateFromRequest);
        console.log("COOKIE STATE", stateFromRequest);

        if (stateFromCookies === stateFromRequest) {
            const { isSignup } = decryptState(stateFromCookies);
            console.log('IS SIGNUP', isSignup)
            const { code, error } = req.query;

            if (error || !code) {
                const urlParams = { message: error as string };
                res.redirect(
                    `${BASE_FRONTEND_URL}/login?error=${JSON.stringify(urlParams)}`
                );
            }

            // Consider reversing url name instead of hardcoding REDIRECT_URI down here
            const { accessToken, refreshToken } = await GoogleAuthService.getTokens(code as string, `${BACKEND_DOMAIN}/${REDIRECT_URI}`)
            console.log('ACCESSSS', accessToken, refreshToken)
            await GoogleAuthService.validateAccessToken(accessToken)
            
            const userData = await GoogleAuthService.getUserInfo(accessToken)
            console.log('USER DATA', userData)
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
                user: {

                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            };

            const cookieOptions = {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 30 minutes in milliseconds
                secure: true,
                httpOnly: true,
                sameSite: "lax" as const,
            };

            res.cookie("NDIC_token", token, cookieOptions);
            res.redirect(
                `${BASE_FRONTEND_URL}?user=${btoa(JSON.stringify(resData))}`
            );
            // res.json(resData);

        } else {
            throw new Error("State parameter mismatch");
        }
    }
});
