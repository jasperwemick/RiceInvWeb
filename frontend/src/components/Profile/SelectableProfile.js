import React, { useState, useEffect, useRef } from "react";
import { Profile } from "./Profile";

export const SelectableProfile = ({profile, setSelectedList, selectedList, refreshTrigger}) => {

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
        <Profile profile={profile} width={50} height={50} clickAction={handleClick} styleOptions={selected ? {backgroundColor: "lightblue"} : null}/>
    )
}