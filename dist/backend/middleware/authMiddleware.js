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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    try {
        // Get token from cookies
        token = req.cookies["NDIC_token"];
        console.log(`USER TOKEN, ${token}`);
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, (process.env.JWT_SECRET || "4345a1cf5f73926f76f90649c5042abb71299f5d0620d17fea8fdab908f7b6bd"));
        console.log(decoded, 'DECODED TOKEN');
        req.user = (yield userModel_1.default.findById(decoded.id).select("-password"));
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
}));
