import { useEffect, useState } from "react"
import { useParams } from "wouter"
import apiFetch from "../../util/fetch";
import type { Tournament, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types";

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

    }, [id])

    return (
        <div></div>
    )
}