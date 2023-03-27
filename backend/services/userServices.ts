import User, { IUser } from "../models/userModel";

export class UserService {
    static async getUser(email: string) {
        return await User.findOne({ email });
    }

    static async createUser(userInfo: Omit<IUser, "createdAt" | "updatedAt">) {
        return await User.create(userInfo);
    }
}
