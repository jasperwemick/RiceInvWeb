import React, { useEffect, useState, type RefObject } from "react";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { TournamentStage } from "../../../data/types";
import { ObjectId } from "bson";

interface ComplexListItemProps {
    item : TournamentStage;
    tournamentData : TournamentStage[];
    setTournamentData : React.Dispatch<React.SetStateAction<TournamentStage[]>>;
    index : number;
}

const defaultStages : Record<string, string[]> = {
    'Groups' : ['Round Robin', 'Swiss', 'Random'], 
    'Bracket' : ['Single Elim', 'Double Elim', 'Biased Double Elim']
}


function ComplexListItem({ item, tournamentData, setTournamentData, index } : ComplexListItemProps) {
    const [selected, setSelected] = useState<string>('');

    useEffect(() => {
        if (selected === '') return;
        const newData : TournamentStage[] = tournamentData.map((d, i) => {

            return i === index ? { ...d, format : selected } : d
        })
        setTournamentData(newData)
    }, [selected])
    return (
        <li className={'tournament-complex-list-item'}>
            <p>{`(${index + 1})`}</p>
            <div>
                <div>
                    <p>{item.stageType}</p>
                    <div className={'tournament-item-list'}>
                        <SelectableItemsList<string>
                        list={defaultStages[item.stageType]}
                        selection={{ selected : selected, setSelected : setSelected, multiple : false }}
                        removalPredicate={(a, b) => a != b}
                        getLabel={(x) => x}/>
                    </div>
                </div>
                <div>
                    <p>{`Name`}</p>
                    <input/>
                </div>
            </div>
        </li>
    )
}

interface SetStagesProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean
}

export default function SetStages({ itemRef, dispatcher, animInProgress } : SetStagesProps) {

    const [stageCount, setStageCount] = useState<number>(0);

    const [tournamentStageData, setTournamentStageData] = useState<TournamentStage[]>([]);

    const undo = () => {
        dispatcher({
            type : 'UNDO_STEP',
            data : { stages : tournamentStageData },
            isStage : false
        })
    }

    const submit = () => {
        dispatcher({ 
            type : 'STEP', 
            data : { 
                step : `Set${tournamentStageData.find(x => x.order === 0)?.stageType}-0`, 
                stages : tournamentStageData,
            },
            isStage : true
        });
    }

    useEffect(() => {
        setTournamentStageData(Array.from({ length : stageCount }, (_, i) => {
            return {
                id : new ObjectId().toHexString(),
                order : i,
                stageType : 'Groups',
                format : null
            }}))    
    }, [stageCount])

    const mapStageToggler = () => {

        const switchStage = (idx : number) => {
            setTournamentStageData(tournamentStageData.map((stage, j) => {
                return j !== idx ? stage : {
                    id : stage.id,
                    order : j,
                    stageType : stage.stageType === 'Groups' ? 'Bracket' : 'Groups',
                    format : null,
                    stageName : stage.stageName
                }
            }));
        }

        return tournamentStageData.map((item, i) => {
            return (
                <div onClick={() => switchStage(i)}>
                    <p>{i + 1}</p>
                    <button>{item.stageType}</button>
                </div>
            )
        })
    }

    const mapFormatSelect = () => {
        return tournamentStageData.map((stage, i) => {
            return (
                <ComplexListItem key={i} item={stage} tournamentData={tournamentStageData} setTournamentData={setTournamentStageData} index={i}/>
            )
        });
    }

    const checkStageData = () : boolean => {
        console.log(tournamentStageData)
        return !tournamentStageData.find(x => x.format === null) && tournamentStageData.length !== 0;
    }
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'} >
                <p>How many Stages?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-participants-grid'}>
                        <SelectableItemsList
                        list={[1, 2, 3]}
                        selection={{ selected : stageCount, setSelected : setStageCount, multiple : false }}
                        removalPredicate={(a, b) => a !== b}
                        getLabel={(x) => String(x)}/>
                    </div>
                </div>
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-switchlist'}>{mapStageToggler()}</div>
                </div>
                <div className={'tournament-configuration-subbox'}>
                    <ul className={'tournament-item-column'}>
                        {mapFormatSelect()}
                    </ul>
                </div>
                {checkStageData() && <button onClick={submit}>Continue</button>}
            </div>
        </li>
    )
}