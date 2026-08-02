import useAuth from "../hooks/useAuth";
import { useRef, useState, useEffect } from 'react';
import GetUrl from "../util/GetUrl";
import { useLocation } from "wouter";
import './style/login.css';
import apiFetch from "../util/fetch";
import type { User } from "../data/types";

export const Login = () => {

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [errMessage, setErrMessage] = useState("");

    const { setAuth } = useAuth();
 
    const [location, navigate] = useLocation();

    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setErrMessage('');
    }, [user, pass])

    const onSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        const loginData = new FormData();
        loginData.append("username", user)
        loginData.append("password", pass)

        try {
            const response = await fetch(`${GetUrl}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                body: loginData
            });
            const data = await response.json();  
            console.log(data.message);
            const actualData = await apiFetch<User>(`${GetUrl}/auth/user`, { credentials: 'include' })
            if (actualData.username) {
                const validUser = actualData?.username;
                const roles = actualData?.roles;
                const profile = actualData?.profileId;
                setAuth({ username: validUser, roles: roles, profileId: profile });

                navigate('/', { replace: true});
            }

            setUser('');
            setPass('');
            
        }
        catch(e : unknown) {
            if (e instanceof Error) {
                setErrMessage(`Bad Login Credentials ${e.message}`);
            }
            else {
                setErrMessage(`No Server Response, ${String(e)}`);
            }
            errRef.current?.focus();
        }
    }


    return (
        <div className={`login-container`}>
            <p ref={errRef}>{errMessage}</p>
            <p>Login</p>
            <form onSubmit={onSubmit} className={`login-form`}>
                <input
                value={user}
                type="text"
                autoComplete="off"
                ref={userRef}
                onChange={e => setUser(e.target.value)}
                placeholder="Username"
                required
                />
                <input
                value={pass}
                type="password"
                onChange={e => setPass(e.target.value)}
                placeholder="Password"
                required
                />
                <button type="submit">Log In</button>
            </form>
        </div>

    )
}