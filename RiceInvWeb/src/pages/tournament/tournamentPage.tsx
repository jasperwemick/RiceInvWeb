import { Link } from "wouter";
import './tournament.css'

export default function TournamentPage() {

    return (
        <div className={'go-to-create-button'}>
            <Link to="/tournament/create"><p>{`Create Tournament!`}</p></Link>
        </div>
    )
}