import React, { useState, useEffect, useRef, useContext } from "react";
import { Profile } from "./Profile";
import './style/profile.css'
import ProfileContext from "./context/ProfileContextProvider";
import useProfiles from "./hooks/useProfiles";
import { DraggableList } from "../DraggableList";


export const ProfileList = ({
    Wrapper=Profile, 
    WrapperProps={width: 200, height: 200, clickAction: null, styleOptions: null}, 
    profileFilter=[], 
    profileContainer='profile-list-container',
    isInfinite=false
}) => {

    const [scrollLength, setScrollLength] = useState(0)
    const [listLength, setListLength] = useState(0)
    const [profileTicks, setProfileTicks] = useState(0)
    const { profiles } = useContext(ProfileContext)

    useProfiles()

    useEffect(() => {

        if (profiles.length > 0 && isInfinite) {

            const itemWidth = (0.5 * listLength) / profiles.length
            const tick = Math.floor(scrollLength / (1.5 * itemWidth * profiles.length))

            if (tick !== profileTicks) {
                setProfileTicks(tick)
            }
        }

    }, [scrollLength])

    /**
     * @returns A list of PlayerProfile components
     */
    function profileList() {
        return profiles.filter((p) => (profileFilter.length === 0 ? true : (profileFilter.find((f) => f === p._id) ? true : false))).map((profile, index) => {
            return (
                <Wrapper profile={profile} {...WrapperProps} key={index}/>
            );
        });
    }

    return (
        <div className={profileContainer}>
            <DraggableList setScrollLength={setScrollLength} setListLength={setListLength} profileTicks={profileTicks}>
                {profileList()}
                {isInfinite ? profileList(): null}
            </DraggableList>
        </div>
    )
};