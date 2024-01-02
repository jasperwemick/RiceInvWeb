import { NavItems, LogItems } from "./navbarItems"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css"
import useAuth from "../hooks/userAuth";

export default function Navbar() {

    const { auth } = useAuth();
    console.log(auth);
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
