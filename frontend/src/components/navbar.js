import { NavItems, LogItems } from "./navbarItems"
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css"
import useAuth from "../hooks/userAuth";

export default function Navbar() {

    const { auth, setAuth } = useAuth();
    console.log(auth);
 
    useEffect(() => {
        async function validateCookie() {
            try {
                const responeAuth = await fetch(`http://127.0.0.1:4000/auth/user`, {
                    credentials: 'include'
                })
                const actualData = await responeAuth.json();
                console.log(actualData.message)
                const roles = actualData?.roles;
                const user = actualData?.user;
                setAuth({ user, roles });
            }
            catch(e) {
                const message = `Failed to Validate: ${e}`;
                console.log(message)
                return;
            }
        }

        validateCookie();
        return;
    }, []);

    const listItems = (obj) => {
        return obj.map((item, index) => {
            return (
                <li key={index} className={item.class}>
                    <Link to={item.path}>{item.text}</Link>
                </li>
            );
        })
    }

    const item = (obj) => {
        return (
            <li className={obj.class}>
                <Link to={obj.path}>{obj.text}</Link>
            </li>
        )
    }

    return (
        <nav>
            <ul className="nav-items">
                {listItems(NavItems)}
                {auth?.user ? item(LogItems[1]): item(LogItems[0]) }
            </ul>
      </nav>
    )
}
