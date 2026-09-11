import { Redirect, useLocation } from "wouter";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RequireAuth({ allowedRoles, children } : RequireAuthProps) {
    const { auth } = useAuth();
    const [ location ] = useLocation();
    
    if (auth?.roles?.find((role: string) => allowedRoles?.includes(role))) {
        return <>{children}</>;
    }

    return auth?.username? (
        <Redirect to="/unauthorized" replace state={{ from: location }}/>
    ) : (
        <Redirect to="/login" replace state={{ from: location }}/>
    );
}