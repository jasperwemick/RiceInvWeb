import { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"
import type { GameMode, Profile, Team, Tournament, TournamentSet, TournamentStage } from "../../data/types";
import CreateStart from "./components/createStart";
import useGetRef from "../../hooks/useGetRef";
import AddParticipants from "./components/addParticipants";
import SetTeams from "./components/setTeams";
import apiFetch from "../../util/fetch";
import CreateTeams from "./components/createTeams";
import SetGame from "./components/setTournamentGame";
import SetStages from "./components/SetStages";
import SetGroups from "./components/SetGroups";
import SetPlayins from "./components/SetPlayins";


export interface TournamentData {
    nextStep : string;
    name ? : string;
    gameMode ? : GameMode;
    participants ? : Profile[] | Team[];
    particpantType ? : 'Profile' | 'Team';
    stages ? : TournamentStage[];
}

interface ProcessSideStep<S extends object = {}> {
    Component: React.ComponentType<S & { itemRef : React.RefObject<HTMLLIElement> }>;
    key : string;
    props?: S;
}

interface ProcessStep<P extends object = {}> {
    Component : React.ComponentType<P & { itemRef : React.RefObject<HTMLLIElement> }>;
    key : string;
    props?: P;
    sidesteps?: ProcessSideStep<any>[]
}



function defineStep<P extends object>(process : ProcessStep<P>) : ProcessStep<P> { return process };
function defineSideStep<S extends object>(process : ProcessSideStep<S>) : ProcessSideStep<S> { return process };


export default function CreateTournamentPage() {

    const [step, setStep] = useState<string>('Start');
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [sideSteping, setSideSteping] = useState<boolean>(false);
    const [tournament, setTournament] = useState<TournamentData | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const [animInProgress, setAnimInProgress] = useState<boolean>(false);

    const listRef = useRef<HTMLUListElement | null>(null);
    const getRef = useGetRef<HTMLLIElement>();

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

    const onRemove = (data : TournamentData) => {
        setStep(data.nextStep);
        setAnimInProgress(false);
    }

    useLayoutEffect(() => {
        const item = getRef(stepIndex).current;
        console.log(item)
        if (item) {
            item.classList.add('active');
            setAnimInProgress(true);
            setTimeout(() => {
                onAdd(item);
            }, 900);
        }
    }, [step])

    useEffect(() => {
        console.log(tournament);
    }, [tournament])

    const NextStep = (data : TournamentData, ss : boolean) => {
        const mergedData = {...tournament, ...data}
        setTournament(mergedData)
        setSideSteping(ss);
        if (ss) return;

        const item = getRef(stepIndex).current;
        setStepIndex(stepIndex + 1);
        if (item) {
            item.classList.add('exiting');
            setAnimInProgress(true);
            setTimeout(() => {
                onRemove(mergedData);
            }, 900);
        }
    }

    const steps : ProcessStep[] = [
        defineStep({ key : 'Start', Component : CreateStart, props : { transition : NextStep } }),
        defineStep({ key : 'SetGame', Component : SetGame, props : { transition : NextStep, animInProgress } }),
        defineStep({ key : 'AddParticipants', Component : AddParticipants, props : { transition : NextStep, animInProgress, profiles } }),
        defineStep({ key : 'SetTeams', Component : SetTeams, props : { transition : NextStep }, sidesteps : [
            defineSideStep({
                Component : CreateTeams, 
                key : 'CreateTeams',
                props : { transition : NextStep, animInProgress, participants : tournament?.participants?.filter(x => x.def == 'Profile'), gameMode : tournament?.gameMode }
            })
        ]}),
        defineStep({ key : 'SetStages', Component : SetStages, props : { transition : NextStep, animInProgress } }),

        // Not implemented
        defineStep({ key : 'SetGroups', Component : SetGroups, props : {}}),
        defineStep({ key : 'SetPlayins', Component : SetPlayins, props : {}}),
        defineStep({ key : 'SetPlayoffs', Component : SetGroups, props : {}})
    ]

    return (
        <div className={'tournament-create'}>
            <ul className={'tournament-illusion-list'} ref={listRef}>
                {steps.map((st, i) => step === st.key && (
                    <st.Component key={i} itemRef={getRef(i)} {...st.props}/>
                ))}
            </ul>
        </div>
    )
}