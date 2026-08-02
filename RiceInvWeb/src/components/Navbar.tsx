import React, { useState, useEffect } from "react";
import "./style/navbar.css"
import useAuth from "../hooks/useAuth";
import { Link } from "wouter";
import { AccountItems, LogItems, type NavbarItem, NavbarItems } from "./NavbarItems";
import apiFetch from "../util/fetch";
import type { User, UserAuth } from "../data/types";

interface NavItemProps {
    item : NavbarItem;
}

function NavItem({ item } : NavItemProps) {

    const [dropdown, setDropdown] = useState(false);

    return (
        <li key={item.text} className={`${item.class}`} onMouseLeave={() => {setDropdown(false)}}>
            <Link to={item.pathTo} className={`nav-button-link`} onMouseOver={() => {setDropdown(true)}}>{item.text}</Link>
            <ul className={`nav-dropdown ${(dropdown && item.dropdownItems) ? '' : 'hidden'}`}>
                {item.dropdownItems?.map((drop, index) => {
                    return (
                        <li key={index} className={drop.class}>
                            <Link to={drop.pathTo}>{drop.text}</Link>
                        </li>
                    )
                })}
            </ul>
        </li>
    )
}


export default function Navbar() {

    const { auth, setAuth } = useAuth();
 
    useEffect(() => {
        async function validateCookie() {
            try {
                const actualData = await apiFetch<UserAuth>(`/auth/user`, { credentials: 'include' });
                const user = actualData?.username;
                const roles = actualData?.roles;
                const profile = actualData?.profileId;
                setAuth({ username : user, roles : roles, profileId : profile });
            }
            catch(e) {
                const message = `Failed to Validate: ${e}`;
                console.log(message)
                return;
            }
        }

        validateCookie();
    }, [auth]);

    const listItems = (obj : NavbarItem[]) => {
        return obj.map((item, index) => {
            return (
                <NavItem
                    item={item}
                    key={index}
                />
            );
        })
    }

    const item = (obj : NavbarItem) => {
        return (
            <li className={obj.class}>
                <Link to={obj.pathTo} className={`nav-button-link`}>{obj.text}</Link>
            </li>
        )
    }

    return (
        <nav className="navbar">
            <ul className="nav-items">
                {listItems(NavbarItems)}
                {auth?.username ? item(AccountItems[0]) : null}
                {auth?.username ? item(LogItems[1]): item(LogItems[0]) }
            </ul>
        </nav>
    )
}
