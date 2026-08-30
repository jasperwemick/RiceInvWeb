import { useEffect, useReducer, useState, type CSSProperties, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import GroupTable from "./GroupTable";
import type { TournamentSubStage, TournamentSet, Profile, Team } from "../../../data/types";



const qualBlockStyle : CSSProperties = { display : 'flex', flexWrap : 'nowrap' }

type QualStatus = 'Qualified' | 'LastChance' | 'Eliminated';

interface QualBlockProps {
    slots : number;
    setSlots : React.Dispatch<React.SetStateAction<number>>;
    index : number;
    subGroup : TournamentSubStage;
    data : TournamentData;
}

function QualBlock({slots, setSlots, index, subGroup, data} : QualBlockProps) {
    
    const [status, setStatus] = useState<QualStatus>(index < slots ? 'Qualified' : 'Eliminated');
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
        
        const setColor = () => {
            switch (status) {
                case 'Qualified' : return '#22ce22ff';
                case 'LastChance' : return '#ffee55ff';
                case 'Eliminated' : return '#ce2222ff';
            }
        }
        setQualStyle({ ...qualStyle, backgroundColor : setColor() });

        const newCount = status === 'Qualified' ? 1 : status === 'LastChance' ? -1 : 0;
        setSlots(slots + newCount)
    }, [status]);
    
    return (
        <li key={index} style={qualStyle} onClick={handleClick}>{index + 1}</li>
    )
}

interface AddTournamentSetsProps {
    itemRef : RefObject<HTMLLIElement>;
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    order : number;
    subGroup : TournamentSubStage;
    data : TournamentData;
    signal : { action ? : string };
}

export default function AddTournamentSets({ itemRef, dispatcher, animInProgress, order, subGroup, data, signal } : AddTournamentSetsProps) {

    const [tSets, addTSets] = useState<TournamentSet[]>([]);
    const [slots, setSlots] = useState<number>(0);

    useEffect(() => {
        // setSlots(Math.ceil(subGroup.members.length / 2));
    }, [subGroup.members.length])

    const undo = () => {
        dispatcher({ type : 'UNDO_SIDESTEP', data : { subStages : [subGroup], sets : tSets }, ss : 'AddTournamentSets'})
    }

    const submit = () => {
        const stg : TournamentSubStage = { ...data.subStages.find(x => x === subGroup), qualificationSlots : slots}
        dispatcher({ type : 'SUBMIT_SIDESTEP', data : { subStages : [stg], sets : tSets }, ss : 'AddTournamentSets' })
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
        console.log('Add tournamnet sets, signal received', signal)
        if (!signal) return;
        if (signal.action === 'undo') undo();
        if (signal.action === 'submit') submit();
    }, [signal]);

    // useEffect(() => {
    //     addTSets(tSets.map((set) => {
    //         return { ...set, subStageOrder : order }
    //     }));
    // }, [order])

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
                <div className={'tournament-configuration-subbox'}>
                    <ul style={qualBlockStyle}>
                        {subGroup.members.map((_, i : number) => {
                            return <QualBlock slots={slots} setSlots={setSlots} index={i} subGroup={subGroup} data={data}/>
                        })}
                    </ul>
                </div>
            </div>
        </li>
    )
}