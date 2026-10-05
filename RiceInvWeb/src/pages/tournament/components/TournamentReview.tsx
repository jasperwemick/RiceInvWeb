import type { RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { TournamentSet, TournamentStage, TournamentSubStage } from "../../../data/types";
import { useLocation } from "wouter";

interface ReviewProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    data : TournamentData
}

export default function TournamentReview({ itemRef, dispatcher, data } : ReviewProps) {

    const [_, navigate] = useLocation();

    const undo = () => {

    }

    const submit = async () => {

        try {

            if (data.participants.length < 2) {
                throw new Error('Not enough participants!!!');
            }

            const tournamentPayload = {
                name : data.name,
                gameMode : data.gameMode?._id || '',
                participants : data.participants.filter(x => x.def !== "Placeholder").flatMap(x => x._id),
                participantType : data.participants[0].def,
                stages : data.stages.map((stage : TournamentStage) => {
                    return {
                        order : stage.order,
                        stageType : stage.stageType,
                        format : stage.format,
                        stageName : stage.stageName || '',
                        subStages : data.subStages
                        .filter((subStage : TournamentSubStage) => subStage.stage === stage.order)
                        .map((subStage) => {
                            return {
                                order : subStage.order,
                                name : subStage.name,
                                format : subStage.format,
                                members : subStage.members.filter(x => x.def !== "Placeholder").flatMap(x => x._id),
                                memberType : data.participants[0].def,
                                sets : data.sets
                                .filter((set : TournamentSet) => set.subStageId === subStage.id)
                                .map((set) => {
                                    return {
                                        order : set.order,
                                        bestOf : set.bestOf,
                                        setName : set.setName || '',
                                        participants : set.participants.filter(x => x.def !== "Placeholder").flatMap(x => x._id),
                                        participantType : data.participants[0].def,
                                        parents : set.parents || [],
                                        lowerSetID : set.lowerSetID || -1,
                                        nextSetID : set.nextSetID || -1,
                                        matches : []
                                    }
                                })
                            }
                        })
                    }
                })
            }

            const res = await fetch(`/api/tournament`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body : JSON.stringify(tournamentPayload)
            });

            if (!res.ok) throw new Error(`Error in POST: ${res.status}`);

            navigate('/tournament');
        }
        catch(e) {
            console.log('Failure to create tournament, ', e);

            navigate('/tournament');
        }
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'}>
                <p>Review</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <button onClick={submit}>Submit</button>
            </div>
        </li>
    )
}