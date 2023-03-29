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
const colors_1 = __importDefault(require("colors"));
const mongoose_1 = require("mongoose");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, mongoose_1.connect)("mongodb+srv://basitbalogun10:CYgM0wCBgYLGZnll@cluster0.ggdjua0.mongodb.net/?retryWrites=true&w=majority");
        console.log(colors_1.default.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
exports.default = connectDB;
