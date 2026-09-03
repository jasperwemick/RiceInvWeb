import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"
import type { GameMode, Placeholder, Profile, TournamentMatch, TournamentParticipant, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types";
import CreateStart from "./components/createStart";
import useGetRef from "../../hooks/useGetRef";
import AddParticipants from "./components/addParticipants";
import SetTeams from "./components/setTeams";
import apiFetch from "../../util/fetch";
import CreateTeams from "./components/createTeams";
import SetGame from "./components/setTournamentGame";
import SetStages from "./components/SetStages";
import SetGroups from "./components/SetGroups";
import AddTournamentSets from "./components/AddTournamentSets";
import React from "react";
import SetBracket from "./components/SetBracket";

interface SideHistoryItem {
    sideStep : string;
    step : string;
    num : number;
}

interface WizardState {
    step: string;
    sideSteps: string[];
    stepIndex: number;
    pendingStep: string | null;
    sideStepIndex: number;
    ssSignal: { action?: string } | null;
    tournament: TournamentData | null;
    currentStage: number;
    placeholders : Placeholder[];
    history: string[];
    ssHistory : SideHistoryItem[],
    animInProgress: boolean;
    pendingTransition: TournamentData | null;
    expectedSubmissions: number;
    receivedSubmissions: number;
    stepIsStage : boolean;
    cache : Record<string, any>;
}

export type WizardAction =
    | { type: 'STEP'; data: TournamentData; activeSSCount ? : number; isStage ? : boolean}
    | { type: 'UNDO_STEP'; data : TournamentData; activeSSCount ? : number; isStage ? : boolean }
    | { type: 'SIDESTEP'; data: TournamentData; ss : string }
    | { type: 'SUBMIT_SIDESTEP'; data : TournamentData; ss : string }
    | { type: 'UNDO_SIDESTEP'; data : TournamentData; ss : string; index : number }
    | { type: 'ANIM_REMOVE_DONE' }
    | { type: 'ANIM_ADD_DONE'; isSideStep: boolean }
    | { type: 'SIGNAL_HANDLED' };

const initialWizardState : WizardState = {
    step: 'Start',
    sideSteps : [],
    stepIndex: 0,
    pendingStep: null,
    sideStepIndex: 0,
    ssSignal: null,
    tournament: null,
    currentStage: -1,
    placeholders : [],
    history: [],
    ssHistory : [],
    animInProgress: false,
    pendingTransition : null,
    expectedSubmissions : 0,
    receivedSubmissions : 0,
    stepIsStage : false,
    cache : {}
};

export interface TournamentData {
    step ? : string;
    name ? : string;
    gameMode ? : GameMode;
    participants ? : TournamentParticipant[];
    particpantType ? : 'Profile' | 'Team' | 'Placeholder';
    stages ? : TournamentStage[];
    subStages ? : TournamentSubStage[];
    sets ? : TournamentSet[];
    matches ? : TournamentMatch[];
}


function assignField<K extends keyof TournamentData>(
    target: TournamentData,
    key: K,
    value: TournamentData[K]
): void { target[key] = value; }

const KEYS: Partial<Record<keyof TournamentData, string>> = {
    participants : 'name',
    sets: 'id',
    matches: 'id',
    stages : 'id',
    subStages: 'id',
};

function removeFields(baseData : TournamentData | null, toRemove : Partial<TournamentData>) : TournamentData {
    const localData = { ...baseData };

    const removeById = <T extends Record<string, any>>(existing: T[] = [], incoming: T[] = [], idKey: string): T[] => {
        const map = new Map(existing.map(item => [item[idKey], item]));
        for (const item of incoming) {
            map.delete(item[idKey]); // adds new, or updates an existing one submitted twice
        }
        return Array.from(map.values());
    }

    for (const key of Object.keys(toRemove) as (keyof TournamentData)[]) {
        const marked = toRemove[key];
        const id = KEYS[key]
        if (Array.isArray(marked) && id) {
            assignField(localData, key, removeById(localData[key] as any[], marked, id))
        } else {
            assignField(localData, key, undefined)
        }
    }

    return localData;
}

function mapParticipantPlaceholder(state : WizardState, data : TournamentData) {
    return data.subStages.flatMap((sStg, i) => {
        const sStgMatches = data.matches ? data.matches.filter((match) => {
            return data.sets.find(set => set.id === match.setId)
        }) : [];
        
        return sStg.members.map((member) : Placeholder => {
            return {
                def : 'Placeholder',
                name : '',
                subId : i,
                subSize : sStg.members.length,
                points : sStgMatches.filter(x => x.winner === member).length
            }
        }).sort((a, b) => a.points - b.points).slice(0, sStg.qualificationSlots)
    })
}


function commitNextStep(state: WizardState, data: TournamentData): WizardState {
    const mergedData = { ...state.tournament, ...data };
    return {
        ...state,
        tournament: mergedData,
        stepIndex: state.stepIndex + 1,
        pendingStep: data.step,
        sideSteps : [],
        sideStepIndex: 0,
        history: [...state.history, state.step],
        currentStage: state.stepIsStage ? state.currentStage + 1 : state.currentStage,
        placeholders: (state.stepIsStage && mergedData.subStages) ? mapParticipantPlaceholder(state, mergedData) : [],
        animInProgress: true,
        pendingTransition: null,
        expectedSubmissions: 0,
        receivedSubmissions: 0,
    };
}

function commitPrevStep(state: WizardState, data: TournamentData) : WizardState {

    const filteredData = removeFields(state.tournament, data);
    const prevHistory = [...state.history];
    const prevStep = prevHistory.pop() ?? state.step;

    const prevSSHistory = [...state.ssHistory]
    const prevSide = prevSSHistory.filter(x => x.step === prevStep);

    return {
        ...state,
        tournament: filteredData,
        stepIndex: state.stepIndex - 1,
        pendingStep: prevStep,
        sideSteps : [...prevSide.flatMap(x => x.sideStep)],
        sideStepIndex: prevSide.reduce((acc, ss) => {
            return acc + ss.num; 
        }, 0),
        history: prevHistory,
        currentStage: state.stepIsStage ? state.currentStage - 1 : -1,
        placeholders: (state.stepIsStage && filteredData.subStages) ? mapParticipantPlaceholder(state, filteredData) : [],
        animInProgress: true,
        pendingTransition: null,
        expectedSubmissions: 0,
        receivedSubmissions: 0,
    };
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {

    switch (action.type) {
        case 'STEP': {
            if (!action.activeSSCount || action.activeSSCount === 0) {
                return commitNextStep({
                    ...state,
                    stepIsStage : action.isStage
                }, action.data);
            }
            // hold the transition, signal sidesteps to submit, wait for them
            return {
                ...state,
                pendingTransition: action.data,
                expectedSubmissions: action.activeSSCount,
                receivedSubmissions: 0,
                ssSignal: { action: 'submit' },
            };
        }

        case 'UNDO_STEP': {
            if (!action.activeSSCount || action.activeSSCount === 0) {
                return commitPrevStep({
                    ...state,
                    stepIsStage : action.isStage
                }, action.data);
            }

            // hold the transition, signal sidesteps to submit, wait for them
            return {
                ...state,
                pendingTransition: action.data,
                expectedSubmissions: action.activeSSCount,
                receivedSubmissions: 0,
                ssSignal: { action: 'undo' },
            };
        }

        case 'SIDESTEP': {
            const mergedData = { ...state.tournament, ...action.data };
            const exists = state.ssHistory.find(x => x.step === state.step);
            const sideSteps = [...state.sideSteps]
            return {
                ...state,
                tournament: mergedData,
                sideSteps: [...sideSteps, action.ss],
                sideStepIndex : state.sideStepIndex + 1,
                ssHistory : exists ? state.ssHistory.map(x => 
                    x.step === state.step
                    ? {...x, num : x.num + 1}
                    : x
                ) : [...state.ssHistory, { sideStep : action.ss, step : state.step, num : 1 }]
            };
        }

        case 'UNDO_SIDESTEP' : {
            const newReceivedCount = state.receivedSubmissions + 1;
            const sidesteps = [...state.sideSteps];
            const cleared = sidesteps.filter(x => x === action.ss).splice(action.index, 1);
            const filtered = sidesteps.filter(x => x !== action.ss).concat(cleared);

            const localData = removeFields(state.tournament, action.data);

            const history = state.ssHistory.map(
                x => x.sideStep === action.ss && x.step === state.step
                ? x.num > 1 ? { ...x, num : x.num - 1 } : undefined : x
            ).filter(x => x !== undefined);
            // Undo primary step if this is the last side step to undo
            if (newReceivedCount >= state.expectedSubmissions && state.pendingTransition) {
                return commitPrevStep(
                    { 
                        ...state, 
                        ssHistory : history,
                        tournament: localData, 
                        // receivedSubmissions: newReceivedCount 
                    },
                    state.pendingTransition
                );
            }

            return {
                ...state,
                tournament : localData,
                ssHistory : history,
                sideSteps : filtered,
                sideStepIndex : state.sideStepIndex - 1,
                receivedSubmissions : newReceivedCount
            }
        }

        case 'SUBMIT_SIDESTEP': {
            const newReceivedCount = state.receivedSubmissions + 1;

            const toUpsert = action.data
            const localData = { ...state.tournament };


            const upsertById = <T extends Record<string, any>>(existing: T[] = [], incoming: T[] = [], idKey: string): T[] => {
                const map = new Map(existing.map(item => [item[idKey], item]));
                for (const item of incoming) {
                    map.set(item[idKey], item); // adds new, or updates an existing one submitted twice
                }
                return Array.from(map.values());
            }

            for (const key of Object.keys(toUpsert) as (keyof TournamentData)[]) {
                const marked = toUpsert[key];
                const id = KEYS[key]
                
                if (Array.isArray(marked) && id) {
                    assignField(localData, key, upsertById(localData[key] as any[], marked, id))
                } else {
                    assignField(localData, key, marked)
                }
            }
            if (newReceivedCount >= state.expectedSubmissions && state.pendingTransition) {
                // last submission arrived — NOW actually commit the held transition
                return commitNextStep(
                    { 
                        ...state, 
                        tournament: localData, 
                        // receivedSubmissions: newReceivedCount 
                    },
                    state.pendingTransition
                );
            }

            return {
                ...state,
                tournament: localData,
                receivedSubmissions: newReceivedCount,
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
            return { 
                ...state, 
                // stepIndex : state.stepIndex + 1, 
                animInProgress: false 
            };

        case 'SIGNAL_HANDLED':
            return {
                ...state,
                ssSignal : null
            }

        default: {
            const _ = action;
            return state;
        }
    }
}

interface ProcessSideStep<S extends object = {}> {
    Component: React.ComponentType<S & { 
        itemRef : React.RefObject<HTMLLIElement>, 
        dispatcher : React.ActionDispatch<[action: WizardAction]>
        data : TournamentData, 
        signal : { action ? : string}
    }>;
    key : string;
    parentKey : string;
    props?: S;
}

interface ProcessStep<P extends object = {}> {
    Component : React.ComponentType<P & { 
        itemRef : React.RefObject<HTMLLIElement>,
        dispatcher : React.ActionDispatch<[action: WizardAction]>
        data : TournamentData,
    }>;
    key : string;
    props?: P;
    sidesteps?: ProcessSideStep<any>[]
}


function defineStep<P extends object>(process : ProcessStep<P>) : ProcessStep<P> { return process };
function defineSideStep<S extends object>(process : ProcessSideStep<S>) : ProcessSideStep<S> { return process };


export default function CreateTournamentPage() {

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
    const { placeholders, step, stepIndex, sideSteps, sideStepIndex, ssSignal, tournament, currentStage, animInProgress } = state;

    const listRef = useRef<HTMLUListElement | null>(null);

    const ANIMSPEED = 200;

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

    const steps : ProcessStep[] = [
        defineStep({ key : 'Start', Component : CreateStart }),
        defineStep({ key : 'SetGame', Component : SetGame, props : { animInProgress } }),
        defineStep({ key : 'AddParticipants', Component : AddParticipants, props : { animInProgress, profiles } }),
        defineStep({ key : 'SetTeams', Component : SetTeams, sidesteps : [
            defineSideStep({
                Component : CreateTeams, 
                key : 'CreateTeams',
                parentKey : 'SetTeams',
                props : { animInProgress, participants : tournament?.participants?.filter(x => x.def == 'Profile'), gameMode : tournament?.gameMode }
            })
        ]}),
        defineStep({ key : 'SetStages', Component : SetStages, props : { animInProgress } }),

        // Not implemented
        defineStep({ key : 'SetGroups', Component : SetGroups, props : { 
            animInProgress, 
            stageNum : currentStage, 
            participants : currentStage > 0 ? placeholders : tournament?.participants
        }, 
        sidesteps : tournament?.subStages?.map((subStage, index) => {
            return defineSideStep({
                Component : AddTournamentSets, 
                key : 'AddTournamentSets', 
                parentKey : 'SetGroups', 
                props : { animInProgress, subGroup : subStage, order : index, parentList : tournament.subStages }
            });
        })}),
        defineStep({ key : 'SetBracket', Component : SetBracket, props : { 
            animInProgress, 
            stageNum : currentStage, 
            participants : currentStage > 0 ? placeholders : tournament?.participants
        }})
    ]

    useLayoutEffect(() => {
        if (state.pendingStep === null || stepIndex < 0) return; 

        const idx = steps.indexOf(steps.find(x => x.key === step));
        const item = getRef(idx).current;
        console.log('exiting, ', item);
        if (item) {
            item.classList.add('exiting');
            const timer = setTimeout(() => {
                dispatch({ type: 'ANIM_REMOVE_DONE' });
            }, ANIMSPEED);
            return () => clearTimeout(timer);
        }
    }, [stepIndex]);

    // Enter animation — fires whenever `step` actually commits
    useLayoutEffect(() => {
        const idx = steps.indexOf(steps.find(x => x.key === step));
        const item = getRef(idx).current;
        if (item) {
            item.classList.add('active');
            const timer = setTimeout(() => {
                item.classList.remove('active');
                dispatch({ type: 'ANIM_ADD_DONE', isSideStep: false });
            }, ANIMSPEED);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Sidestep enter/undo animation
    useLayoutEffect(() => {
        const item = getSideRef(sideStepIndex).current;
        if (item) {
            item.classList.add('side-active');
            const timer = setTimeout(() => {
                item.classList.remove('side-active');
                dispatch({ type: 'ANIM_ADD_DONE', isSideStep: true });
            }, ANIMSPEED);
            return () => clearTimeout(timer);
        }
    }, [sideSteps.length]);

    useEffect(() => {
        if (ssSignal) {
            console.log('handle signal, ', ssSignal);
            dispatch({ type: 'SIGNAL_HANDLED' });
        }
        
    }, [ssSignal]);

    useEffect(() => {
        console.log(tournament);
    }, [tournament])

    return (
        <div className={'tournament-create'}>
            <ul className={'tournament-illusion-list'} ref={listRef}>
                {steps.map((st, i) => {
                    return (
                        <React.Fragment>
                            {
                                step === st.key && 
                                <st.Component 
                                key={i} 
                                itemRef={getRef(i)} 
                                data={tournament} 
                                dispatcher={dispatch}
                                {...st.props}/>
                            }
                            {
                                st.sidesteps?.map((sst, j) => {
                                    return sideSteps.includes(sst.key) && step === sst.parentKey &&
                                    <sst.Component 
                                    key={i + j + 999} // Temporary bs
                                    itemRef={getSideRef(j)} 
                                    data={tournament} 
                                    signal={ssSignal} 
                                    dispatcher={dispatch}
                                    {...sst.props}/>
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