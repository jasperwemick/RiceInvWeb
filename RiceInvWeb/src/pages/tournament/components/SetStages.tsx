import React, { useEffect, useState, type RefObject } from "react";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import type { TournamentData } from "../createTournamentPage";
import type { Stage, TournamentStage } from "../../../data/types";

interface ComplexListItemProps {
    item : Stage;
    tournamentData : TournamentStage[];
    setTournamentData : React.Dispatch<React.SetStateAction<TournamentStage[]>>;
    index : number;
}


function ComplexListItem({ item, tournamentData, setTournamentData, index } : ComplexListItemProps) {
    const [selected, setSelected] = useState<string>('');

    useEffect(() => {
        
    }, [item.stage]);

    useEffect(() => {
        const newData : TournamentStage[] = tournamentData.map((d, i) => {

            return i === index ? { ...d, format : selected } : d
        })
        setTournamentData(newData)
        console.log(newData);
    }, [selected])
    return (
        <li className={'tournament-complex-list-item'}>
            <p>{`(${index + 1})`}</p>
            <div>
                <div>
                    <p>{item.stage}</p>
                    <div className={'tournament-item-list'}>
                        <SelectableItemsList<string>
                        list={item.formats}
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
    transition : (data : TournamentData, ss ? : { undo : boolean }) => void;
    animInProgress : boolean
}

export default function SetStages({ itemRef, transition, animInProgress } : SetStagesProps) {

    const [stageCount, setStageCount] = useState<number>(1);

    const defaultStages = [
        {
            stage : 'Groups',
            formats : ['Round Robin', 'Swiss', 'Random']
        }, 
        {
            stage : 'Playins',
            formats : ['Seeding', 'Qualifier Elim']
        },
        {
            stage : 'Playoffs',
            formats : ['Single Elim', 'Double Elim', 'Biased Double Elim']
        }
    ]

    const [stages, setStages] = useState<Stage[]>(defaultStages);
    const [tournamentStageData, setTournamentStageData] = useState<TournamentStage[]>([]);

    useEffect(() => {
        console.log(stageCount);
        setStages(defaultStages.filter((x, i) => i < stageCount));
    }, [stageCount])

    useEffect(() => {
        if (tournamentStageData.length === 0) {
            setTournamentStageData(stages.map((stg, index) => {
                return {
                    order : index,
                    stageType : stg.stage,
                    format : null
                }
            }));
        }
        else {
            setTournamentStageData(stages.map((stg, index) => {
                if (tournamentStageData[index] && stg.stage != tournamentStageData[index].stageType) {
                    return {
                        order : index,
                        stageType : stg.stage,
                        format : null,
                        stageName : ''
                    }
                }
                else {
                    return {
                        ...tournamentStageData[index]
                    }
                }
            }))
        }

    }, [stages]);


    const mapStageToggler = () => {

        const switchStage = (idx : number) => {
            setStages(stages.map((stage, j) => {
                const p = defaultStages.find(x => x.stage === stage.stage);
                return j !== idx ? stage : defaultStages[(defaultStages.indexOf(p) + 1) % defaultStages.length];
            }));
        }

        return stages.map((item, i) => {
            return (
                <div onClick={() => switchStage(i)}>
                    <p>{i + 1}</p>
                    <button>{item.stage}</button>
                </div>
            )
        })
    }

    const mapFormatSelect = () => {
        
        return stages.map((stage, i) => {
            return (
                <ComplexListItem item={stage} tournamentData={tournamentStageData} setTournamentData={setTournamentStageData} index={i}/>
            )
        });
    }

    const checkStageData = () : boolean => {
        return !tournamentStageData.find(x => x.format === null);
    }
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>How many Stages?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-participants-grid'}>
                        <SelectableItemsList
                        list={[1, 2, 3]}
                        selection={{ selected : stageCount, setSelected : setStageCount, multiple : false }}
                        removalPredicate={(a, b) => a != b}
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
                {checkStageData() && <button onClick={() => transition({ nextStep : 'SetGroups', stages : tournamentStageData })}>Continue</button>}
            </div>
        </li>
    )
}