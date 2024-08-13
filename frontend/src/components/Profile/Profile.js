import React from "react";

export const Profile = ({profile, width, height, clickAction, styleOptions}) => {

    return (
        <li>
            <div onClick={() => clickAction ? clickAction(): null} style={styleOptions}>
                {/* <img src={profile.imageUrl} width={width} height={height} alt="Player Profile"></img> */}
                <p>{profile.name}</p>
            </div>
        </li>
    )
};