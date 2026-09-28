import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import GroupTable from "./GroupTable";
import type { TournamentSubStage, TournamentSet } from "../../../data/types";



const qualBlockStyle : CSSProperties = { display : 'flex', flexWrap : 'nowrap' }

type QualStatus = 'Qualified' | 'LastChance' | 'Eliminated';

interface QualBlockProps {
    slots : number;
    setSlots : React.Dispatch<React.SetStateAction<number>>;
    index : number;
    subGroup : TournamentSubStage;
    data : TournamentData;
}

function QualBlock({slots, setSlots, index} : QualBlockProps) {
    
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

interface SubGroupsSetsProps {
    itemRef : RefObject<HTMLLIElement>;
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    order : number;
    subStage : TournamentSubStage;
    data : TournamentData;
    signal : { action ? : string };
}

export default function SubGroupsSets({ itemRef, dispatcher, animInProgress, order, subStage, data, signal } : SubGroupsSetsProps) {

    const [tSets, addTSets] = useState<TournamentSet[]>(data.sets ? data.sets.filter(x => x.subStageId === subStage.id) : []);
    const [slots, setSlots] = useState<number>(subStage.qualificationSlots ? subStage.qualificationSlots : 0);

    useEffect(() => {
        // setSlots(Math.ceil(subGroup.members.length / 2));
    }, [subStage.members.length]);

    const undo = () => {
        dispatcher({ 
            type : 'UNDO_SIDESTEP',
            data : { subStages : [subStage], sets : tSets },
            ss : `SubGroupsSets-${subStage.stage}-${order}`,
            index : order
        });
    }

    const submit = () => {
        const cachedSubStage = data.subStages.find(x => x.id === subStage.id);
        if (!cachedSubStage) {
            // Throw some error
            return;
        }
        const stg : TournamentSubStage = { ...cachedSubStage, qualificationSlots : slots};
        dispatcher({ type : 'SUBMIT_SIDESTEP', data : { subStages : [stg], sets : tSets }, ss : `SubGroupsSets-${subStage.stage}-${order}` });
    }

    useEffect(() => {
        if (!signal) return;
        if (signal.action === 'undo') undo();
        if (signal.action === 'submit') submit();
    }, [signal]);

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'}>
                <p>{subStage.name}</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    {!animInProgress && 
                    <GroupTable 
                    groupSize={subStage.members.length} 
                    members={subStage.members} 
                    subId={subStage.id}
                    sets={tSets}
                    setSets={addTSets} 
                    interactive={true}/>}
                </div>
                <div className={'tournament-configuration-subbox'}>
                    <ul style={qualBlockStyle}>
                        {subStage.members.map((_, i : number) => {
                            return <QualBlock slots={slots} setSlots={setSlots} index={i} subGroup={subStage} data={data}/>
                        })}
                    </ul>
                </div>
            </div>
        </li>
    )
}