import React, { useState, useEffect, useRef } from "react";
import './style/account.css'
import './style/login.css'
import useAuth from "../hooks/userAuth";
import { useLocation, useNavigate } from "react-router-dom";
import GetUrl from "../GetUrl";

export const Account = () => {

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [passCopy, setPassCopy] = useState("");
    const [errMessage, setErrMessage] = useState("");

    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const errRef = useRef();

    useEffect(() => {
        setErrMessage('');
    }, [user, pass])

    useEffect(() => {
        setUser(auth.user ? auth.user : '')
    }, [auth])

    const onSubmit = (e) => {
        e.preventDefault();

        if (pass !== passCopy) {
            setErrMessage('Passwords Don\'t Match', e);
            return
        }

        const loginData = new FormData();
        loginData.append("username", user)
        loginData.append("password", pass)

        const handlePassword = async () => {
            try {
                // Update password
                const response = await fetch(`${GetUrl}/auth/password/reset`, {
                    method: 'PUT',
                    credentials: 'include',
                    body: loginData
                });
                const data = await response.json();  
    
                // Logout
                if (data.status === 'success') {
                    await fetch(`${GetUrl}/auth/logout`, {
                        credentials: "include",
                    })
                    setAuth({})
        
                    navigate(from, { replace: true});
        
                    setPass('');
                    setPassCopy('');
                }
                else {
                    setErrMessage(data.message);
                }
            }
            catch(e) {
                if (!e?.response) {
                    setErrMessage('No Server Response', e);
                }
                else {
                    setErrMessage('Passwords Don\'t Match', e);
                }
                errRef.current.focus();
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