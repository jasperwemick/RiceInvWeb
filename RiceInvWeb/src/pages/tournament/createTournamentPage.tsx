import { createRef, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type RefObject } from "react"
import type { GameMode, Profile, Team, Tournament, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types";
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

interface WizardState {
    step: string;
    stepIndex: number;
    pendingStep: string | null; // the step we're animating TOWARD, set by NEXT_STEP, consumed by ANIM_REMOVE_DONE
    sideStep: { nss: string; undo: boolean };
    sideStepIndex: number;
    ssSignal: { action?: string } | null;
    tournament: TournamentData | null;
    currentStage: number;
    history: string[];
    animInProgress: boolean;
}

type WizardAction =
    | { type: 'NEXT_STEP'; data: TournamentData }
    | { type: 'ENTER_SIDESTEP'; data: TournamentData; undo: boolean }
    | { type: 'ANIM_REMOVE_DONE' } // fired after the exit-animation setTimeout — commits the pending step
    | { type: 'ANIM_ADD_DONE'; isSideStep: boolean } // fired after the enter-animation setTimeout
    | { type: 'SIDESTEP_ADVANCE' } // the non-undo branch of the sideStep useLayoutEffect
    | { type: 'SIDESTEP_UNDO' }
    | { type: 'UNDO_STEP' }
    | { type: 'TRIGGER_SIDESTEP_SIGNAL' }
    | { type: 'SIGNAL_HANDLED' };

const initialWizardState : WizardState = {
    step: 'Start',
    stepIndex: 0,
    pendingStep: null,
    sideStep: { nss: '', undo: false },
    sideStepIndex: 0,
    ssSignal: null,
    tournament: null,
    currentStage: 0,
    history: [],
    animInProgress: false,
};

export interface TournamentData {
    nextStep : string;
    name ? : string;
    gameMode ? : GameMode;
    participants ? : Profile[] | Team[];
    particpantType ? : 'Profile' | 'Team';
    stages ? : TournamentStage[];
    subStages ? : TournamentSubStage[];
    isStage ? : boolean;
    sets ? : TournamentSet[];
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'NEXT_STEP': {
            const mergedData = { ...state.tournament, ...action.data };
            if (action.data.nextStep === '') {
                return { ...state, tournament: mergedData };
            }
            return {
                ...state,
                tournament: mergedData,
                history: [...state.history, state.step],
                currentStage: action.data.isStage ? state.currentStage + 1 : state.currentStage,
                stepIndex: state.stepIndex + 1,
                pendingStep: action.data.nextStep, // NOT committed to `step` yet — waits for exit animation
                animInProgress: true,
                ssSignal : { action: 'submit' }
            };
        }

        case 'ENTER_SIDESTEP': {
            const mergedData = { ...state.tournament, ...action.data };
            return {
                ...state,
                tournament: mergedData,
                sideStep: { nss: action.data.nextStep, undo: action.undo },
            };
        }

        case 'ANIM_REMOVE_DONE':
            return {
                ...state,
                step: state.pendingStep ?? state.step,
                pendingStep: null,
                animInProgress: false,
            };

        case 'ANIM_ADD_DONE':
            return { ...state, animInProgress: false };

        case 'SIDESTEP_ADVANCE':
            return { ...state, sideStepIndex: state.sideStepIndex + 1, animInProgress: true };

        case 'SIDESTEP_UNDO':
            return { ...state, sideStepIndex: Math.max(0, state.sideStepIndex - 1) };

        case 'UNDO_STEP': {
            if (state.sideStep.nss === state.step) {
                return { ...state, ssSignal: { action: 'undo' } };
            }
            const prevHistory = [...state.history];
            const prevStep = prevHistory.pop() ?? state.step;
            return {
                ...state,
                history: prevHistory,
                step: prevStep,
                stepIndex: Math.max(0, state.stepIndex - 1),
                currentStage: state.tournament?.isStage ? Math.max(0, state.currentStage - 1) : state.currentStage,
            };
        }

        case 'SIGNAL_HANDLED':
            return {
                ...state,
                ssSignal: null,
                sideStep: { nss: '', undo: false },
                sideStepIndex: 0,
            };

        default: {
            const _ = action;
            return state;
        }
    }
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

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
    const { step, stepIndex, sideStep, sideStepIndex, ssSignal, tournament, currentStage, history, animInProgress } = state;

    const listRef = useRef<HTMLUListElement | null>(null);

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

    const getRef = useGetRef<HTMLLIElement>();
    const getSideRef = useGetRef<HTMLLIElement>();

    function NextStep(data: TournamentData, ss?: { undo: boolean }) {
        if (ss) {
            dispatch({ type: 'ENTER_SIDESTEP', data, undo: ss.undo });
            return;
        }
        dispatch({ type: 'NEXT_STEP', data });
    }

    // Exit animation — fires whenever stepIndex changes (a NEXT_STEP was dispatched)
    useLayoutEffect(() => {
        if (state.pendingStep === null) return; // nothing pending, don't fire on initial mount
        const item = getRef(stepIndex - 1).current; // the OUTGOING item, one behind the new stepIndex
        if (item) {
            item.classList.add('exiting');
            const timer = setTimeout(() => {
                dispatch({ type: 'ANIM_REMOVE_DONE' });
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [stepIndex]);

    // Enter animation — fires whenever `step` actually commits
    useLayoutEffect(() => {
        const item = getRef(stepIndex).current;
        if (item) {
            item.classList.add('active');
            const timer = setTimeout(() => {
                item.classList.remove('active');
                dispatch({ type: 'ANIM_ADD_DONE', isSideStep: false });
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Sidestep enter/undo animation
    useLayoutEffect(() => {
        if (sideStep.nss === '') return;
        if (sideStep.undo) {
            dispatch({ type: 'SIDESTEP_UNDO' });
            return;
        }
        const item = getSideRef(sideStepIndex).current;
        dispatch({ type: 'SIDESTEP_ADVANCE' });
        if (item) {
            item.classList.add('side-active');
            const timer = setTimeout(() => {
                item.classList.remove('side-active');
                dispatch({ type: 'ANIM_ADD_DONE', isSideStep: true });
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [sideStep]);

    const undoStep = () => {
        if (!tournament || animInProgress) return;
        dispatch({ type: 'UNDO_STEP' });
    };

    useEffect(() => {
        if (ssSignal) {
            if (ssSignal.action === 'undo') undoStep();
            dispatch({ type: 'SIGNAL_HANDLED' });
        }
        
    }, [ssSignal]);

    useEffect(() => {
        console.log(tournament);
    }, [tournament])

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
        sidesteps : tournament?.subStages?.map((subStage, index) => {
            return defineSideStep({
                Component : AddTournamentSets,
                key : 'AddTournamentSets',
                parentKey : 'SetGroups',
                props : { transition : NextStep, animInProgress, subGroup : subStage, order : index, parentList : tournament.subStages }
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