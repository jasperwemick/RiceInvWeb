import { useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { Profile, Team } from "../../../data/types";
import { ObjectId } from "bson";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import ListDropdownItem from "../../../components/SelectableList/listDropdownItem";

interface SetTeamsProps {
    itemRef : RefObject<HTMLLIElement>;
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    data : TournamentData;
    animInProgress : boolean;
}

export default function SetTeams({ itemRef, dispatcher, data, animInProgress } : SetTeamsProps) {
    
    const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
    const [teamName, setTeamName] = useState<string>('');
    const [teams, setTeams] = useState<Team[]>(data.participants.filter(x => x.def === 'Team'));
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

    const undo = () => {
        dispatcher({
            type : 'UNDO_STEP',
            data : { participants : [...teams] }
        })
        setTeamName('');
        setTeamMembers([]);
        setSelectedTeams([]);
    }

    const submit = () => {
        dispatcher({type : 'STEP', data : { 
            step : 'SetStages', 
            participants : teams, 
            particpantType : 'Team' 
        }});
    }

    const saveTeam = () => {
        if (teams.flatMap((x) => x.name).includes(teamName) || teamName.length < 3 || teamMembers.length < 2) {
            return;
        }
        const team : Team = {
            _id : new ObjectId().toHexString(),
            def : 'Team',
            name : teamName,
            members : teamMembers
        }
        setTeams([...teams, team]);
        setTeamName('');
        setTeamMembers([]);
    }

    const removeTeams = () => {
        const selectedNames = selectedTeams.flatMap(x => x.name);
        setTeams(teams.filter((x) => !selectedNames.includes(x.name)));
        setSelectedTeams([]);
        setTeamMembers([]);
    }

    const getUnlockedProfiles = () => {
        const locked = teams.flatMap(x => x.members.flatMap(x => x._id));
        return data.participants.filter((x) => x.def === 'Profile' && !locked.includes(x._id)) as Profile[];
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'} >
                <button onClick={undo}>{`X`}</button>
                <p>Team Builder</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    <p>{`Team Size : ${data.gameMode?.teamSize}`}</p>
                    <div className={'tournament-participants-grid'}>
                        {!animInProgress && data.gameMode && 
                        <SelectableItemsList<Profile> 
                        list={getUnlockedProfiles()} 
                        selection={{ selected : teamMembers, setSelected : setTeamMembers, multiple : true }} 
                        limit={data.gameMode.teamSize}
                        removalPredicate={(a, b) => a.name != b.name} 
                        getLabel={(x) => x.name}/>}
                    </div>
                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
                    <button onClick={saveTeam}>Add</button>
                </div>
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-participants-grid'}>
                        {!animInProgress && 
                        <SelectableItemsList<Team, { subItems : (x : Team) => string[] }> 
                        list={teams} 
                        selection={{ selected : selectedTeams, setSelected : setSelectedTeams, multiple : true }} 
                        removalPredicate={(a, b) => a.name != b.name} 
                        getLabel={(x) => x.name}
                        ComponentItem={ListDropdownItem}
                        ExtraProps={{subItems : (x) => x.members.flatMap(x => x.name)}}/>}
                    </div>
                    {selectedTeams.length > 0 && <button onClick={removeTeams}>Remove</button>}
                </div>
                <button onClick={submit}>Continue</button>
            </div>
        </li>
    )
}