import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { User } from "../data/types";

interface AuthContextProps {
    auth : User | null;
    setAuth : Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children } : { children : ReactNode }) => {
    const [auth, setAuth] = useState<User | null>(null);
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;