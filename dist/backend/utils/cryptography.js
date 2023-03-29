"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptState = exports.decryptData = exports.encryptData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const initVector = process.env.INIT_VECTOR || "029f65452f4af94c1dba82f8fb0f6acb";
const secretKey = process.env.SECRET_KEY ||
    "4345a1cf5f73926f76f90649c5042abb71299f5d0620d17fea8fdab908f7b6bd";
const algorithm = process.env.ENCRYPTION_ALGORITHM || "aes-256-cbc";
const charEncoding = process.env.CHARACTER_ENCODING || "hex";
if (!initVector || !secretKey || !algorithm || !charEncoding) {
    throw new Error("initVector, secretKey, algorithm and charEncoding are all required");
}
const encryptData = (data) => {
    const cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(secretKey, "hex"), Buffer.from(initVector, "hex"));
    const encryptedData = cipher.update(data, "utf-8", "hex") + cipher.final("hex");
    return encryptedData;
};
exports.encryptData = encryptData;
const decryptData = (encryptedData) => {
    const decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(secretKey, "hex"), Buffer.from(initVector, "hex"));
    const decryptedData = decipher.update(encryptedData, "hex", "utf-8") +
        decipher.final("utf-8");
    return decryptedData;
};
exports.decryptData = decryptData;
const decryptState = (encryptedState) => {
    const rawState = (0, exports.decryptData)(encryptedState);
    console.log('RAW STATE', rawState);
    // const state = decodeURI(rawState).split(',')[0]
    console.log('DECODE URI', decodeURI(rawState));
    const isSignup = JSON.parse(decodeURI(rawState).split(",")[1]);
    return { isSignup };
};
exports.decryptState = decryptState;
