import { createContext } from "react"

export interface User {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
}

interface UserContextType{
    user: User | null;
    handleUserChange: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = UserContext.Provider
export default UserContext