import { Link } from "wouter";
import './tournament.css'

export default function TournamentPage() {

    const GoToCreate = () => {

    }

    return (
        <div className={'go-to-create-button'}>
            <Link to="/tournament/create"/>
        </div>
    )
}