import { Schema, model } from "mongoose";

export interface IUser  {
    createdAt: NativeDate;
    email: string;
    firstName: string;
    googlePictureUrl?: string | undefined;
    googleRefreshToken?: string | undefined;
    lastName: string;
    password: string;
    updatedAt: NativeDate;
}

const userSchema = new Schema<IUser>(
    {
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
    },
    {
        timestamps: true,
    }
);

const User = model<IUser>("User", userSchema);
export default User
