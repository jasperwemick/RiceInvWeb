import React, { useState, useEffect, useRef, useContext } from "react";
import { Profile } from "./Profile";
import './style/profile.css'
import ProfileContext from "./context/ProfileContextProvider";
import useProfiles from "./hooks/useProfiles";

export const ProfileList = ({shiftOffset=200, Wrapper=Profile, WrapperProps={width: 200, height: 200, clickAction: null, styleOptions: null}, profileFilter=[], profileContainer='profile-list-container'}) => {

    const scrollRef = useRef(null);

    const { profiles } = useContext(ProfileContext)

    useProfiles()

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

    /**
     * @param {Number} offset - The offset value to shift the list
     */
    const shift = (offset) => {
        scrollRef.current.scrollLeft += offset;
    }

    return (
        <div className={profileContainer}>
            <button className={`profile-shift-button`} onClick={() => shift(-1 * shiftOffset)}>{'<'}</button>
            <ul ref={scrollRef} className="profile-list">{profileList()}</ul>
            <button className={`profile-shift-button`} onClick={() => shift(shiftOffset)}>{'>'}</button>
        </div>
    )
};