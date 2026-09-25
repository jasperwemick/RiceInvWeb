import { Link } from "wouter";
import './tournament.css'
import { useEffect, useState } from "react";
import apiFetch from "../../util/fetch";
import type { Tournament } from "../../data/types";
import DraggableList from "../../components/DraggableList";

export default function TournamentPage() {

    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        const getTournaments = async () => {
            try {
                const ts = await apiFetch<Tournament[]>(`/api/tournament`);
                setTournaments(ts);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message)
                return;
            }
        }
        getTournaments();
    }, []);

    const mapTournaments = () => {
        return tournaments.map((tours, i) => {
            return <li key={i}>{tours.name}</li>
        })
    }

    return (
        <div className={`tournament-page`}>
            <div className={`tournament-page-text`}><p>{`Check out existing or previous tournaments`}</p></div>
            <DraggableList<Tournament> items={tournaments} className={`tournament-list`}>
                {mapTournaments()}
            </DraggableList>
            <div className={`tournament-page-text`}><p>{`Or... make your own tournament now!`}</p></div>
            <div className={'go-to-create-button'}>
                <Link to="/tournament/create"><p>{`Create a Tournament!`}</p></Link>
            </div>
        </div>
    )
}