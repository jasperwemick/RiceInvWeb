import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Profile } from "../../data/types";
import ProfileListItem from "./ProfileListItem";

interface SelectableProfileProps {
    profile : Profile;
    setSelectedList : Dispatch<SetStateAction<string[]>>;
    selectedList : string[];
    refreshTrigger : any;
}

export const SelectableProfile = ({profile, setSelectedList, selectedList, refreshTrigger} : SelectableProfileProps) => {

    const [selected, setSelected] = useState(false)

    useEffect(() => {

        if (selectedList.find((p) => p === profile._id)) {
            setSelected(true)
        }
        else {
            setSelected(false)
        }

    }, refreshTrigger)

    const handleClick = () => {
        const newStatus = !selected


        if (newStatus) {
            setSelectedList([...selectedList, profile._id])
        }
        else {
            setSelectedList(selectedList.filter((pid) => pid !== profile._id))
        }

        setSelected(newStatus)

    }

    return (
        <ProfileListItem profile={profile} width={50} height={50} clickAction={handleClick} styleOptions={selected ? {backgroundColor: "lightblue"} : undefined}/>
    )
}