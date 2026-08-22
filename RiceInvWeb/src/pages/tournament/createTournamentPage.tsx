import { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"
import type { GameMode, Profile, StageGroup, Team, Tournament, TournamentSet, TournamentStage } from "../../data/types";
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
import AddTournamentSets from "./components/AddTournamentSets";
import React from "react";
import SetPlayoffs from "./components/SetPlayoffs";


export interface TournamentData {
    nextStep : string;
    name ? : string;
    gameMode ? : GameMode;
    participants ? : Profile[] | Team[];
    particpantType ? : 'Profile' | 'Team';
    stages ? : TournamentStage[];
    subStages ? : StageGroup[];
    isStage ? : boolean;
    sets ? : TournamentSet[];
}

interface ProcessSideStep<S extends object = {}> {
    Component: React.ComponentType<S & { itemRef : React.RefObject<HTMLLIElement>, data : TournamentData, signal : { action ? : string}}>;
    key : string;
    parentKey : string;
    props?: S;
}

interface ProcessStep<P extends object = {}> {
    Component : React.ComponentType<P & { itemRef : React.RefObject<HTMLLIElement>, data : TournamentData }>;
    key : string;
    props?: P;
    sidesteps?: ProcessSideStep<any>[]
}


function defineStep<P extends object>(process : ProcessStep<P>) : ProcessStep<P> { return process };
function defineSideStep<S extends object>(process : ProcessSideStep<S>) : ProcessSideStep<S> { return process };


export default function CreateTournamentPage() {

    const [step, setStep] = useState<string>('Start');
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [sideStep, setSideStep] = useState<{ nss : string, undo : boolean }>({ nss : '', undo : false});
    const [sideStepIndex, setSideStepIndex] = useState<number>(0);
    const [ssSignal, setSSSignal] = useState<{action ? : string}>(null);
    
    const [tournament, setTournament] = useState<TournamentData | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentStage, setCurrentStage] = useState<number>(0);
    const [history, setHistory] = useState<string[]>([]);

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

    const onAdd = (item : HTMLLIElement, ss ? : boolean) => {
        item.classList.remove(ss ? 'side-active' : 'active');
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
            }, 200);
        }
    }, [step, stepIndex])

    useLayoutEffect(() => {
        if (sideStep.nss === '') return;
        if (sideStep.undo) {
            setSideStepIndex(sideStepIndex - 1)
            console.log('undo ', sideStepIndex - 1)
            return;
        }
        // const newIndex = stepIndex === sideStepIndex ? stepIndex + 1 : sideStepIndex + 1;
        // console.log(newIndex);
        // const item = getRef(newIndex).current;
        // setSideStepIndex(newIndex);
        // console.log("side ", item);
        const item = getSideRef(sideStepIndex).current;
        setSideStepIndex(sideStepIndex + 1);
        console.log(item)
        if (item) {
            item.classList.add('side-active');
            setAnimInProgress(true);
            setTimeout(() => {
                onAdd(item, true);
            }, 200);
        }

    }, [sideStep])

    useEffect(() => {
        console.log(tournament);
    }, [tournament])

    const undoStep = () => {
        if (!tournament || animInProgress) return;
        if (tournament.isStage) setCurrentStage(currentStage > 0 ? currentStage - 1 : 0);
        console.log('undo blocked, ', sideStep.nss);

        if (sideStep.nss === step) {
            setSSSignal({action : 'undo'});
            return;
        }
        
        setStepIndex(stepIndex - 1);
        console.log('history: ', history);
        setStep(history.pop());
    }

    // Reset signal after being sent
    useEffect(() => {
        if (ssSignal) {
            setSSSignal(null);
            setSideStep({nss : '', undo : false});
            setSideStepIndex(0);
            undoStep();
        }
    }, [ssSignal])

    function NextStep ( data : TournamentData, ss ? : { undo : boolean } ) {
        const mergedData = {...tournament, ...data}
        setTournament(mergedData)

        if (data.nextStep === '') return;
        
        if (ss) {
            setSideStep({ nss : data.nextStep, undo : ss.undo});
            return;
        }
        // setSideStep({ nss : '', undo : false});
        // setSideStepIndex(0);
        setHistory([...history, step]);

        if (data.isStage) {
            setCurrentStage(currentStage + 1);
        }
        
        const item = getRef(stepIndex).current;
        setStepIndex(stepIndex + 1);
        if (item) {
            item.classList.add('exiting');
            setAnimInProgress(true);
            setTimeout(() => {
                onRemove(mergedData);
            }, 200);
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
                parentKey : 'SetTeams',
                props : { transition : NextStep, animInProgress, participants : tournament?.participants?.filter(x => x.def == 'Profile'), gameMode : tournament?.gameMode }
            })
        ]}),
        defineStep({ key : 'SetStages', Component : SetStages, props : { transition : NextStep, animInProgress } }),

        // Not implemented
        defineStep({ key : 'SetGroups', Component : SetGroups, props : { 
            transition : NextStep, 
            animInProgress, 
            stageNum : currentStage, 
            participants : tournament?.participants
        }, 
        sidesteps : tournament?.subStages?.map((subStage) => {
            return defineSideStep({
                Component : AddTournamentSets,
                key : 'AddTournamentSets',
                parentKey : 'SetGroups',
                props : { transition : NextStep, animInProgress, subGroup : subStage, parentList : tournament.subStages }
            });
        })}),
        defineStep({ key : 'SetPlayins', Component : SetPlayins, props : {
            transition : NextStep, 
            animInProgress, 
            stageNum : currentStage, 
            participants : tournament?.participants
        }}),
        defineStep({ key : 'SetPlayoffs', Component : SetPlayoffs, props : { 
            transition : NextStep, 
            animInProgress, 
            stageNum : currentStage, 
            participants : tournament?.participants
        }})
    ]

    return (
        <div className={'tournament-create'}>
            <button onClick={undoStep}>Back</button>
            <ul className={'tournament-illusion-list'} ref={listRef}>
                {steps.map((st, i) => {
                    return (
                        <React.Fragment>
                            {
                                step === st.key && 
                                <st.Component key={i} itemRef={getRef(i)} data={tournament} {...st.props}/>
                            }
                            {
                                st.sidesteps?.map((sst, j) => {
                                    return sideStep.nss === sst.key && step === sst.parentKey &&
                                    <sst.Component key={i + j + 1} itemRef={getSideRef(j)} data={tournament} signal={ssSignal} {...sst.props}/>
                                })
                            }
                        </React.Fragment>
                    )
                }
                )}
            </ul>
        </div>
    )
}