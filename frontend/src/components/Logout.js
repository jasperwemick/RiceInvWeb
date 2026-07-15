import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import GetUrl from "../GetUrl";

export default function Logout() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { setAuth } = useAuth();

    useEffect(() => {
        async function log() {
            const response = await fetch(`${GetUrl}/auth/logout`, {
                credentials: "include",
            })
            await response.json();
            setAuth({})
            navigate(from, {replace: true});
        }

        log();
    }, [])

    return null;
}