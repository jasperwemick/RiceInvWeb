import React from "react";
import { Link } from "react-router-dom";

export const Profile = ({profile, wt, ht, setEditorState, editorState, editorField}) => (
    <li>
        <div onClick={() => {setEditorState((editorField == 'upper') ? {...editorState, upperSeed: profile._id} : {...editorState, lowerSeed: profile._id})}}>
            {/* <img src={profile.imageUrl} width={wt} height={ht} alt="Player Profile"></img> */}
            <span>{profile.name}</span>
        </div>
    </li>
);