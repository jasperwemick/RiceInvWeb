import { useEffect, useReducer, useState, type CSSProperties, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import GroupTable from "./GroupTable";
import type { TournamentSubStage, TournamentSet, Profile, Team } from "../../../data/types";



const qualBlockStyle : CSSProperties = { display : 'flex', flexWrap : 'nowrap' }

type QualStatus = 'Qualified' | 'LastChance' | 'Eliminated';

interface QualBlockProps {
    initStatus : QualStatus;
    index : number;
    transition : (data : TournamentData, ss ? : { undo : boolean } ) => void;
    subGroup : TournamentSubStage;
    data : TournamentData;
}

function QualBlock({initStatus, index, transition, subGroup, data} : QualBlockProps) {
    
    const [status, setStatus] = useState<QualStatus>(initStatus);
    const [qualStyle, setQualStyle] = useState<CSSProperties>({
        minWidth : '2rem',
        minHeight : '2rem', 
    });

    const handleClick = () => {
        const next = status === 'Qualified' ? 'LastChance' : 
        status === 'LastChance' ? 'Eliminated' : 'Qualified';
        setStatus(next);
    }

    useEffect(() => {
        
        console.log("ppeee")
        const setColor = () => {
            switch (status) {
                case 'Qualified' : return '#22ce22ff';
                case 'LastChance' : return '#ffee55ff';
                case 'Eliminated' : return '#ce2222ff';
            }
        }
        setQualStyle({ ...qualStyle, backgroundColor : setColor() });

        const numCheck = subGroup?.qualificationSlots ?? 0;
        const newCount = numCheck + (status === 'Qualified' ? 1 : status === 'LastChance' ? -1 : 0);
        // const subReplace : TournamentSubStage = { ...subGroup, qualificationSlots : newCount }
        // const newSubs : TournamentSubStage[] = [...data.subStages.filter(x => x !== subGroup), subReplace]
        
        const rep : TournamentSubStage[] = data.subStages.map((sub) => 
            sub === subGroup
            ? { ...sub, qualificationSlots : newCount }
            : sub
        )

        transition({ nextStep : '', subStages : rep });
        
    }, [status]);
    
    return (
        <li key={index} style={qualStyle} onClick={handleClick}>{index + 1}</li>
    )
}

interface AddTournamentSetsProps {
    itemRef : RefObject<HTMLLIElement>;
    transition : (data : TournamentData, ss ? : { undo : boolean } ) => void;
    animInProgress : boolean;
    order : number;
    subGroup : TournamentSubStage;
    data : TournamentData;
    signal : { action ? : string };
}

export default function AddTournamentSets({ itemRef, transition, animInProgress, order, subGroup, data, signal } : AddTournamentSetsProps) {

    const [tSets, addTSets] = useState<TournamentSet[]>([]);

    const undo = () => {
        const filteredStages = data.subStages.filter(x => x !== subGroup);
        const filteredSets = data.sets?.filter(x => !tSets.find(
                y => y.stageOrder === x.stageOrder &&
                y.subStageOrder === x.subStageOrder &&
                y.setId === x.setId
            ));
        addTSets([]);
        transition({ nextStep : 'AddTournamentSets', subStages : filteredStages, sets : filteredSets }, { undo : true })
    }

    const submit = () => {
        transition({ nextStep : '', sets : [...(data.sets ? data.sets : []), ...tSets]})
    }

    // useEffect(() => {
    //     let setsToAdd = tSets;
    //     if (data.sets) {
    //         setsToAdd = tSets.filter(x => !data.sets.find(
    //             y => y.stageOrder === x.stageOrder &&
    //             y.subStageOrder === x.subStageOrder &&
    //             y.setId === x.setId
    //         ));
    //     }
    //     transition({ nextStep : '', sets : [...(data.sets ? data.sets : []), ...setsToAdd]})
    // }, [tSets]);

    useEffect(() => {
        if (!signal) return;
        if (signal.action === 'undo') undo();
        if (signal.action === 'submit') submit();
    }, [signal]);

    useEffect(() => {
        addTSets(tSets.map((set) => {
            return { ...set, subStageOrder : order }
        }));
        console.log("order i will have: ", order);
    }, [order])

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <button onClick={undo}>{`X`}</button>
                <p>{subGroup.name}</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    {!animInProgress && 
                    <GroupTable 
                    groupSize={subGroup.members.length} 
                    members={subGroup.members} 
                    stageNum={subGroup.stage}
                    tableNum={order}
                    setSets={addTSets} 
                    interactive={true}/>}
                </div>
                {/* <div className={'tournament-configuration-subbox'}>
                    <ul style={qualBlockStyle}>
                        {subGroup.members.map((_, i : number) => {
                            const init = i < Math.ceil(subGroup.members.length / 2) ? 'Qualified' : 'Eliminated';
                            return <QualBlock initStatus={init} index={i} transition={transition} subGroup={subGroup} data={data}/>
                        })}
                    </ul>
                </div> */}
            </div>
        </li>
    )
}