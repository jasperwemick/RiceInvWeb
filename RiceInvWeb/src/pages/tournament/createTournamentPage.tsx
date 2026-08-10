import { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"
import type { GameMode, Profile, Team, Tournament, TournamentSet } from "../../data/types";
import CreateStart from "./components/createStart";
import useGetRef from "../../hooks/useGetRef";
import AddParticipants from "./components/addParticipants";
import SetTeams from "./components/setTeams";
import apiFetch from "../../util/fetch";
import CreateTeams from "./components/createTeams";
import SetGame from "./components/setTournamentGame";


export interface TournamentData {
    step : string;
    name ? : string;
    gameMode ? : GameMode;
    participants ? : Profile[] | Team[];
    particpantType ? : 'Profile' | 'Team';
    sets ? : TournamentSet[];
}

export default function CreateTournamentPage() {

    const [step, setStep] = useState<number>(0);
    const [sideStep, setSideStep] = useState<number>(0);
    const [tournament, setTournament] = useState<TournamentData | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const [animInProgress, setAnimInProgress] = useState<boolean>(false);

    const listRef = useRef<HTMLUListElement | null>(null);
    const getRef = useGetRef<HTMLLIElement>();
    const getSideRef = useGetRef<HTMLLIElement>();

    useEffect(() => {

        const getPlayers = async () =>  {
            try {
                const profs = await apiFetch<Profile[]>('/api/profiles/noimg');
                setProfiles(profs.map((prof) => {return {def : 'Profile', ...prof}}));
            }
            catch(e) {
                console.log('Failed to fetch: ', e);
            }
        }

        getPlayers();
    }, []);

    const onAdd = (item : HTMLLIElement) => {
        item.classList.remove('active');
        setAnimInProgress(false);
    }

    const onRemove = () => {
        setStep(step + 1);
        setAnimInProgress(false);
    }

    useLayoutEffect(() => {
        const item = getRef(step).current;
        if (item) {
            item.classList.add('active');
            setAnimInProgress(true);
            setTimeout(() => {
                onAdd(item);
            }, 900);
        }
    }, [step])

    const NextStep = (data : TournamentData, ss : boolean) => {
        setTournament({...tournament, ...data})
        console.log({...tournament, ...data})
        if (ss) {
            setSideStep(sideStep + 1);
            return;
        }

        const item = getRef(step).current;
        if (item) {
            item.classList.add('exiting');
            setAnimInProgress(true);
            setTimeout(() => {
                onRemove();
            }, 900);
        }
    }

    return (
        <div className={'tournament-create'}>
            <ul className={'tournament-illusion-list'} ref={listRef}>
                {step === 0 && <CreateStart itemRef={getRef(0)} transition={NextStep}/>}
                {/* {step === 1 && <SetGame itemRef={getRef(0)} transition={NextStep} animInProgress={animInProgress}/>} */}
                {step === 1 && <AddParticipants itemRef={getRef(1)} transition={NextStep} animInProgress={animInProgress} profiles={profiles}/>}
                {step === 2 && <SetTeams itemRef={getRef(2)} transition={NextStep}/>}
                {step === 2 && sideStep === 1 && 
                <CreateTeams 
                itemRef={getSideRef(1)} 
                transition={NextStep} 
                animInProgress={animInProgress} 
                participants={tournament.participants.filter(x => x.def == 'Profile')}/>}
            </ul>
        </div>
    )
}