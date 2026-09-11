import { useState, useEffect } from "react";
import type { Profile } from "../../data/types";
import ProfileListItem from "./ProfileListItem";

export interface SelectableProfileProps {
    setSelectedList : (arr : Profile[]) => void;
    selectedList : Profile[];
    refreshTrigger : any;
}

export default function SelectableProfile({profile, setSelectedList, selectedList, refreshTrigger} : { profile : Profile } & SelectableProfileProps) {

    const [selected, setSelected] = useState(false)

    useEffect(() => {

        if (selectedList.find((p) => p._id === profile._id)) {
            setSelected(true)
        }
        else {
            setSelected(false)
        }

    }, refreshTrigger)

    const handleClick = () => {
        const newStatus = !selected


        if (newStatus) {
            setSelectedList([...selectedList, profile])
        }
        else {
            setSelectedList(selectedList.filter((p) => p._id !== profile._id))
        }

        setSelected(newStatus)

    }

    return (
        <ProfileListItem profile={profile} width={50} height={50} clickAction={handleClick} styleOptions={selected ? {backgroundColor: "lightblue"} : undefined}/>
    )
}