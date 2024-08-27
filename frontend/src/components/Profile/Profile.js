import React from "react";

export const Profile = ({profile, width=200, height=200, clickAction=null, styleOptions=null}) => {

    return (
        <li>
            <div onClick={() => clickAction ? clickAction(): null} style={styleOptions}>
                <img src={profile.imageUrl} width={width} height={height} alt="Player Profile"></img>
                <p>{profile.gamertag}</p>
            </div>
        </li>
    )
};