import Placement from "../../../components/Placement";
import { FlatGameProfile, GameMode } from "../../../data/types";

interface ProfileRankItemProps {
    profile : FlatGameProfile;
    modeName : string;
}

interface ProfileRanksProps {
    profiles : FlatGameProfile[];
    mode : GameMode
}

function ProfileRankItem({ profile, modeName } : ProfileRankItemProps) {
    return (
        <div className="ranks-parent-grid">
            <div className="ranks-grid-item">{profile.playerName}</div>
            <div className="ranks-grid-item">{profile.gameModes.find((x) => x.mode === modeName)?.rank}</div>
        </div>
    )
}

export default function ProfileRanks({ profiles, mode } : ProfileRanksProps) {

    return profiles.map((profile) => {
        return (
            <ProfileRankItem profile={profile} modeName={mode.mode} /> 
        );
    });
}