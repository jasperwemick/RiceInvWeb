import { CSSProperties } from "react";
import { Profile } from "../../data/types";
import ProfileListItem from "./ProfileListItem";
import { useLocation } from "wouter";

interface NavigationProfileProps {
    profile : Profile;
    currentLocation : any;
    styleOptions : CSSProperties | undefined;
}

export const NavigationProfile = ({profile, currentLocation, styleOptions} : NavigationProfileProps) => {

    const [location, useNavigate] = useLocation();

    const handleClick = () => {
        useNavigate(`${currentLocation}${profile._id}`)
    }

    return (
        <ProfileListItem profile={profile} clickAction={handleClick} styleOptions={styleOptions}/>
    )
}