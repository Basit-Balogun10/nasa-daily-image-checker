"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCharacters = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const generateToken = (user) => {
    const issuedAt = new Date().getTime();
    const tokenPayload = {
        id: user._id,
        email: user.email,
        iat: issuedAt,
    };
    return jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET || "4345a1cf5f73926f76f90649c5042abb71299f5d0620d17fea8fdab908f7b6bd", {
        expiresIn: "7d",
    });
};
exports.generateToken = generateToken;
const generateRandomCharacters = (length) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateRandomCharacters = generateRandomCharacters;
