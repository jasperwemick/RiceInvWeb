import React from "react";

export const Profile = ({profile, width, height, clickAction, styleOptions}) => {

    return (
        <li>
            <div onClick={() => clickAction()} style={styleOptions}>
                <img src={profile.imageUrl} width={width} height={height} alt="Player Profile"></img>
                <span>{profile.name}</span>
            </div>
        </li>
    )
};