import React from "react";
import ProfileListItem from "./ProfileListItem";
import './style/profile.css'
import useProfiles from "./hooks/useProfiles";
import DraggableList from "../DraggableList";
import type { Profile } from "../../data/types";

interface ProfileListProps<P extends object = {}> {
    Wrapper? : ({profile} : {profile : Profile} & P) => React.JSX.Element;
    WrapperProps? : P;
    profileFilter? : string[];
    profileContainer? : string;
    isInfinite? : boolean;
}

export default function ProfileList<P extends object = {}>({
    Wrapper = ProfileListItem as unknown as (props: { profile: Profile } & P) => React.JSX.Element,
    WrapperProps = {} as P,
    profileFilter = [],
    profileContainer = 'profile-list-container',
    isInfinite = false
} : ProfileListProps<P>) {

    const { profiles } = useProfiles();

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
            <DraggableList items={profiles} animate={true}>
                {profileList()}
                {isInfinite ? profileList(): null}
            </DraggableList>
        </div>
    )
};