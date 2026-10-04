import { useEffect, useState, type CSSProperties } from "react";
import type { Profile } from "../../data/types";
import ProfileListItem from "./ProfileListItem";
import { useLocation } from "wouter";
import useCountdown from "../../hooks/useCountdown";

interface NavigationProfileProps {
    profile : Profile;
    currentLocation : any;
}

export const NavigationProfile = ({profile, currentLocation} : NavigationProfileProps) => {

    const DELAYTIME = 500;
    const REVEALTIME = 1200;

    const [_, useNavigate] = useLocation();
    const [mosueDown, setMouseDown] = useState<boolean>(false);
    const [ccover, setCover] = useState<boolean>(false);

    const { subTime, start, reset } = useCountdown([
        {
            initTime : DELAYTIME, 
            task : () => {
                setTimeout(() => { // Wait for time update, change to reducer probably
                    setCover(true);
                }, 50)
                
            }, 
            tickRate : 20
        },
        {
            initTime : REVEALTIME, 
            task : () => {
                useNavigate(`/profile/${profile._id}`);
            }, 
            tickRate : 20
        }
    ]);

    useEffect(() => {

    }, []);

    const handleMouseEnter = (e : React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (mosueDown) return;
        start();
    }

    const handleMouseLeave = (e : React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setCover(false);
        reset();
    }

    const handleMouseDown = (e : React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setMouseDown(true);
        setCover(false);
        reset();
    }

    const handleMouseUp = (e : React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setMouseDown(false);
    }

    useEffect(() => {
        console.log((1 - Math.abs(subTime / REVEALTIME)) * 100);
    }, [ccover])

    return (
        <ProfileListItem 
        profile={profile} 
        front={{ 
            opacity : 1, 
            background: 'linear-gradient(var(--blue-periwinkle), var(--blue-purple))', 
            border: '2px solid var(--gray-primary)',
            width : '100%', 
            height : '100%',
            borderRadius: '1rem',
            willChange : 'top',
            top : `${ ccover ? (1 - Math.abs(subTime / REVEALTIME)) * 100 : 0}%`
        }}
        style={{ 
            willChange : 'boxShadow',
            boxShadow : `0 0 0.5rem 0.5rem rgba(235, 250, 255, ${
                (1 - Math.abs(subTime / DELAYTIME))
            })`,
            borderRadius : '1rem'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}/>
    )
}