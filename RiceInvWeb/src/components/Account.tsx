import React, { useState, useEffect, useRef } from "react";
import './style/account.css'
import './style/login.css'
import useAuth from "../hooks/useAuth";
import { useLocation } from "wouter";

export const Account = () => {

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [passCopy, setPassCopy] = useState("");
    const [errMessage, setErrMessage] = useState("");

    const { auth, setAuth } = useAuth();

    const [location, navigate] = useLocation();
    // const from = location.state?.from?.pathname || '/';

    const errRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        setErrMessage('');
    }, [user, pass])

    useEffect(() => {
        setUser(auth ? auth.username : '')
    }, [auth])

    const onSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        if (pass !== passCopy) {
            setErrMessage('Passwords Don\'t Match');
            return
        }

        const loginData = new FormData();
        loginData.append("username", user)
        loginData.append("password", pass)

        const handlePassword = async () => {
            try {
                // Update password
                const response = await fetch(`/auth/password/reset`, {
                    method: 'PUT',
                    credentials: 'include',
                    body: loginData
                });
                const data = await response.json();  
    
                // Logout
                if (data.status === 'success') {
                    await fetch(`/auth/logout`, {
                        credentials: "include",
                    })
                    setAuth(null);
        
                    navigate('/', { replace: true});
        
                    setPass('');
                    setPassCopy('');
                }
                else {
                    setErrMessage(data.message);
                }
            }
            catch(e : unknown) {
                if (e instanceof Error) {
                    setErrMessage('Passwords Don\'t Match');
                }
                else {
                    setErrMessage(`No Server Response, ${String(e)}`);
                }
                errRef.current?.focus();
            }
        }

        handlePassword()

    }

    return (
        <div className="login-container">
            <p>Password Reset</p>
            <form onSubmit={onSubmit} className={`login-form`}>
                <input
                value={pass}
                type="text"
                autoComplete="off"
                onChange={e => setPass(e.target.value)}
                placeholder="Password"
                required
                />
                <input
                value={passCopy}
                type="text"
                autoComplete="off"
                onChange={e => setPassCopy(e.target.value)}
                placeholder="Re-enter Password"
                required
                />
                <button type="submit">Reset Password</button>
            </form>
            <p ref={errRef}>{errMessage}</p>
        </div>
    )
}