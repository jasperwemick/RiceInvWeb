import React, { useState, useEffect } from "react";
import { Profile } from "./Profile";
import { useNavigate } from "react-router-dom";

export const NavigationProfile = ({profile, currentLocation}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${currentLocation}${profile._id}`)
    }

    return (
        <Profile profile={profile} clickAction={handleClick}/>
    )
}