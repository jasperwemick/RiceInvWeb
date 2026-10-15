import { useEffect, useState } from "react"
import { useParams } from "wouter"
import apiFetch from "../../util/fetch";
import type { Tournament, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types";
import GroupTable from "./components/GroupTable";
import { GenerateBracket } from "../../components/Bracket/GenerateBracket";

interface StageDisplayProps {
    stage : TournamentStage;
    subStages : TournamentSubStage[];
    sets : TournamentSet[];
}

function StageDisplay({ stage, subStages, sets } : StageDisplayProps) {

    if (stage.stageType === 'Groups') {
        return subStages.map((substg) => {
            console.log(sets.filter(x => x.subStage === substg._id));
            return <GroupTable key={stage.order} groupSize={substg.members.length} members={substg.members} sets={sets.filter(x => x.subStage === substg._id)}/>
        });
    }
    else {
        return subStages.map((substg) => {
            return <GenerateBracket key={stage.order} stage={stage} subStage={substg} players={substg.members} sets={sets.filter(x => x.subStage === substg._id)}/>
        });
    }
}

export default function TournamentDetails() {

    const { id } = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [stages, setStages] = useState<TournamentStage[]>([]);
    const [subStages, setSubStages] = useState<TournamentSubStage[]>([]);
    const [sets, setSets] = useState<TournamentSet[]>([]);
    

    useEffect(() => {

        interface Payload {
            tournament : Tournament;
            stages : TournamentStage[];
            subStages : TournamentSubStage[];
            sets : TournamentSet[];
        }

        const getTournament = async () => {
            const tournamentPayload = await apiFetch<Payload>(`/api/tournament/${id}/stage/substage/set`);
            setTournament(tournamentPayload.tournament);
            setStages(tournamentPayload.stages);
            setSubStages(tournamentPayload.subStages);
            setSets(tournamentPayload.sets);
        }

        getTournament();

    }, [id]);

    const mapStages = () => {
        return stages.sort((a, b) => a.order - b.order).map((stg) => {
            const localSubs = subStages.filter((x) => x.stage === stg._id);
            const localSets = sets.filter((x) => localSubs.flatMap(x => x._id).includes(x.subStage));
            return <StageDisplay stage={stg} subStages={localSubs} sets={localSets}/>
        })
    }

    return (
        <div>
            <div>{tournament?.name}</div>
            <div>{mapStages()}</div>
        </div>
    )
}