import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import { useRef, useState, useEffect } from 'react';
import GetUrl from "../GetUrl";

const Login = () => {

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [errMessage, setErrMessage] = useState("");

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const userRef = useRef();
    const errRef = useRef();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMessage('');
    }, [user, pass])

    const onSubmit = async (e) => {
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
            const responeAgain = await fetch(`${GetUrl}/auth/user`, {
                credentials: 'include'
            })
            const actualData = await responeAgain.json();
            if (actualData.user) {
                const validUser = actualData?.user;
                const roles = actualData?.roles;
                const profile = actualData?.profile;
                setAuth({ user: validUser, roles, profile });

                navigate(from, { replace: true});
            }

            setUser('');
            setPass('');
            
        }
        catch(e) {
            if (!e?.response) {
                setErrMessage('No Server Response', e);
            }
            else {
                setErrMessage('Bad Login Credentials', e);
            }
            errRef.current.focus();
        }
    }


    return (
        <div>
            <p ref={errRef}>{errMessage}</p>
            <div><p>Login</p></div>
            <form onSubmit={onSubmit}>
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

export default Login;