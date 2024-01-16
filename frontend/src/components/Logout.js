import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/userAuth";

export default function Logout() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { setAuth } = useAuth();

    useEffect(() => {
        async function log() {
            const response = await fetch("http://127.0.0.1:4000/auth/logout", {
                credentials: "include",
            })
            const taskResult = await response.json();
            console.log(taskResult.message)
            setAuth({})
        }

        log();
        navigate(from, {replace: true});
        return;
    })

}