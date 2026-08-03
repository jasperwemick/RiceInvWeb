import type { CSSProperties } from "react";
import type { Profile } from "../../data/types";

interface ProfileListItemProps {
    width? : number;
    height? : number;
    clickAction? : () => void;
    styleOptions? : CSSProperties | undefined
}

export default function ProfileListItem({profile, width=200, height=200, clickAction=(() => {}), styleOptions=undefined} : { profile : Profile } &ProfileListItemProps) {
    return (
        <li>
            <div onDoubleClick={() => clickAction ? clickAction(): null} style={styleOptions}>
                <img src={profile.imageUrl} width={width} height={height} alt="Player Profile" draggable={`false`}></img>
                <p>{profile.name}</p>
            </div>
        </li>
    )
};