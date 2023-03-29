"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWithGoogle = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authServices_1 = require("../services/authServices");
const userServices_1 = require("../services/userServices");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
// @desc    Register new user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }
    // Check if user exists
    if (yield userServices_1.UserService.getUser(email)) {
        res.status(400);
        throw new Error("User already exists");
    }
    // Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    // Create user
    const user = yield userServices_1.UserService.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    if (user) {
        const token = (0, utils_1.generateToken)(user);
        const resData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        };
        res.cookie("NDIC_token", token, cookieOptions);
        res.status(201).json(resData);
    }
    else {
        res.status(400);
        throw new Error("Invalid user data");
    }
}));
// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check for user email
    const user = yield userServices_1.UserService.getUser(email);
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        const token = (0, utils_1.generateToken)(user);
        const resData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        };
        res.cookie("NDIC_token", token, cookieOptions);
        res.status(200).json(resData);
    }
    else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
}));
// @desc    Log out a user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
    };
    res.clearCookie("NDIC_token", cookieOptions);
    res.status(204).json(req.user);
}));
// @desc Signup or Login with Google
// @route GET /api/v1/auth/google
// @access Public
exports.authenticateWithGoogle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    const GOOGLE_AUTH_SCOPE = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const REDIRECT_URI = "api/v1/auth/google/";
    const BASE_BACKEND_URL = "http://localhost:3000";
    const BACKEND_DOMAIN = process.env.BASE_BACKEND_URL || "http://localhost:5000";
    if (req.query.obtainAuthUrl) {
        let state = (0, utils_1.generateRandomCharacters)(20);
        if (req.query.isSignup) {
            state += ',{"isSignup": true}';
        }
        else {
            state += ',{"isSignup": false}';
        }
        console.log("STATE", state);
        const encryptedState = (0, utils_2.encryptData)(state);
        console.log("ENCRYPTED STATE", encryptedState);
        const googleAuthUrlParams = {
            response_type: "code",
            client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID || "687505628240-sverv8j1o0n9r14ci19ja6mvmrq9cuu4.apps.googleusercontent.com",
            redirect_uri: `${BACKEND_DOMAIN}/${REDIRECT_URI}`,
            prompt: "select_account",
            access_type: "offline",
            scope: GOOGLE_AUTH_SCOPE.join(" "),
            state: encryptedState,
        };
        const cookieOptions = {
            maxAge: 30 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        };
        const response_data = {
            googleAuthUrl: `${GOOGLE_AUTH_URL}?${new URLSearchParams(googleAuthUrlParams).toString()}`,
        };
        res.cookie("NDIC_state_param", encryptedState, cookieOptions);
        res.status(200).json(response_data);
    }
    else {
        const stateFromRequest = req.query.state;
        const stateFromCookies = req.cookies["NDIC_state_param"];
        console.log("REQUEST STATE", stateFromRequest);
        console.log("COOKIE STATE", stateFromRequest);
        if (stateFromCookies === stateFromRequest) {
            const { isSignup } = (0, utils_2.decryptState)(stateFromCookies);
            console.log('IS SIGNUP', isSignup);
            const { code, error } = req.query;
            if (error || !code) {
                const urlParams = { message: error };
                res.redirect(`${BASE_BACKEND_URL}/login?error=${JSON.stringify(urlParams)}`);
            }
            // Consider reversing url name instead of hardcoding REDIRECT_URI down here
            const { accessToken, refreshToken } = yield authServices_1.GoogleAuthService.getTokens(code, `${BACKEND_DOMAIN}/${REDIRECT_URI}`);
            console.log('ACCESSSS', accessToken, refreshToken);
            yield authServices_1.GoogleAuthService.validateAccessToken(accessToken);
            const userData = yield authServices_1.GoogleAuthService.getUserInfo(accessToken);
            console.log('USER DATA', userData);
            const firstName = userData.given_name;
            const lastName = userData.family_name || "";
            const userProfileData = {
                email: userData.email,
                firstName,
                googlePictureUrl: userData.picture || "",
                googleRefreshToken: refreshToken,
                lastName,
                password: ""
            };
            let user = yield userServices_1.UserService.getUser(userData.email);
            if (!user) {
                user = yield userServices_1.UserService.createUser(userProfileData);
            }
            const token = (0, utils_1.generateToken)(user);
            const resData = {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            };
            const cookieOptions = {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: true,
                sameSite: "lax",
            };
            res.cookie("NDIC_token", token, cookieOptions);
            res.redirect(`${BASE_BACKEND_URL}?user=${JSON.stringify(resData)}`);
            // res.json(resData);
        }
        else {
            throw new Error("State parameter mismatch");
        }
    }
}));
