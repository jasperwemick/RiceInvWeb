import { NavItems } from "./navbarItems"
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <nav>
            <ul className="nav-items">
                {NavItems.map((item, index) => {
                    return (
                    <li key={index} className={item.class}>
                        <Link to={item.path}>{item.text}</Link>
                    </li>
                    );
                })}
            </ul>
      </nav>
    )
}
