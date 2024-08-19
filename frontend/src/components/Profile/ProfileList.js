import React, { useState, useEffect, useRef } from "react";
import { Profile } from "./Profile";
import GetUrl from "../../GetUrl";
import './style/profile.css'

export const ProfileList = ({shiftOffset=200, Wrapper=Profile, WrapperProps={width: 200, height: 200, clickAction: null, styleOptions: null}, profileFilter=[]}) => {

    const scrollRef = useRef(null);
    console.log("hello")


    const [profiles, setProfiles] = useState([])

    useEffect(() => {

        async function getProfiles() {
            try {
                const response = await fetch(`${GetUrl}/api/profiles/default`);
                const jsponse = await response.json();

                setProfiles(jsponse)
            }
            catch(e) {
                const message = `An error occurred: ${e}`;
                console.log(message)
                return;
            }
        }
        
        getProfiles();
    }, [])

    /**
     * 
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
        <div className="profile-list-container-small">
            <button onClick={() => shift(-1 * shiftOffset)}>{'<'}</button>
            <ul ref={scrollRef} className="profile-list">{profileList()}</ul>
            <button onClick={() => shift(shiftOffset)}>{'>'}</button>
        </div>
    )
    
};