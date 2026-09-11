import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useLocation } from "wouter";

export default function Logout() {

    const [location, navigate] = useLocation();

    const { setAuth } = useAuth();

    useEffect(() => {
        async function log() {
            const response = await fetch(`/auth/logout`, {
                credentials: "include",
            })
            await response.json();
            setAuth(null)
            navigate("/", {replace: true});
        }

        log();
    }, [])

    return null;
}