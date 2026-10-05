import type { CSSProperties } from "react";
import type { Profile } from "../../data/types";

interface ProfileListItemProps extends React.HTMLAttributes<HTMLDivElement> {
    profile : Profile
    width ? : number;
    height ? : number;
    front ? : CSSProperties;
}

export default function ProfileListItem({profile, width=200, height=200, front, ...rest} : ProfileListItemProps) {
    return (
        <li style={{...rest.style, position : 'relative', margin : `0 0.5rem`}}>
            <div style={{ opacity : 0, ...front, position : 'absolute', pointerEvents : 'none', zIndex : 1 }}>
                {/* <img src={profile}></img> */}
            </div>
            <div className={'profile-list-item'} {...rest}>
                <img src={profile.imageUrl} width={width} height={height} alt="Player Profile" draggable={`false`}></img>
                <p>{''}</p>
            </div>
        </li>
    )
};