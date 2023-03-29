"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: false, // 3RD-PARTY AUTH REQUIRES NO PASSWORD
    },
    googlePictureUrl: {
        type: String,
        required: false,
    },
    googleRefreshToken: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
