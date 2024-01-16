import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import { useRef, useState, useEffect } from 'react';

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
            const response = await fetch(`http://127.0.0.1:4000/auth/login`, {
                method: 'POST',
                credentials: 'include',
                body: loginData
            });
            const data = await response.json();  
            console.log(data.message);
            const responeAgain = await fetch(`http://127.0.0.1:4000/auth/user`, {
                credentials: 'include'
            })
            const actualData = await responeAgain.json();
            console.log(actualData.message)
            const roles = actualData?.roles;
            setAuth({ user, roles });
            setUser('');
            setPass('');

            navigate(from, { replace: true});
            
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
            <div><span>Administrator Login</span></div>
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