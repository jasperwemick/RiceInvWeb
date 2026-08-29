import { useEffect, useState, type RefObject } from "react";
import type { GameMode, Profile, Team } from "../../../data/types";
import useGetRef from "../../../hooks/useGetRef";
import type { TournamentData } from "../createTournamentPage";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import ListDropdownItem from "../../../components/SelectableList/listDropdownItem";

interface CreateTeamsProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss ? : { action : string }) => void;
    animInProgress : boolean;
    participants : Profile[];
    gameMode : GameMode;
    data : TournamentData;
    signal : { action ? : string };
}

export default function CreateTeams({ itemRef, transition, animInProgress, participants, gameMode, data, signal } : CreateTeamsProps) {

    const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
    const [teamName, setTeamName] = useState<string>('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

    const undo = () => {
        transition({ nextStep : 'CreateTeams' }, { action : 'undo' });
        setTeams([]);
        setTeamName('');
        setTeamMembers([]);
        setSelectedTeams([]);;
    }

    const submit = () => {
        transition({ nextStep : ''}, { action : 'submit' })
    }

    useEffect(() => {
        if (!signal) return;
        if (signal.action === 'undo') undo();
        if (signal.action === 'submit') submit();
    }, [signal])

    const saveTeam = () => {
        console.log(teamName.length);
        if (teams.flatMap((x) => x.name).includes(teamName) || teamName.length < 3 || teamMembers.length < 2) {
            return;
        }
        const team : Team = {
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
        return participants.filter((x) => !locked.includes(x._id));
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Team Builder</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    <p>{`Team Size : ${gameMode.teamSize}`}</p>
                    <div className={'tournament-participants-grid'}>
                        {!animInProgress && 
                        <SelectableItemsList<Profile> 
                        list={getUnlockedProfiles()} 
                        selection={{ selected : teamMembers, setSelected : setTeamMembers, multiple : true }} 
                        limit={gameMode.teamSize}
                        removalPredicate={(a, b) => a._id != b._id} 
                        getLabel={(x) => x.name}/>}
                    </div>
                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
                    <button onClick={saveTeam}>Add</button>
                </div>
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-participants-grid'}>
                        {!animInProgress && 
                        <SelectableItemsList<Team> 
                        list={teams} 
                        selection={{ selected : selectedTeams, setSelected : setSelectedTeams, multiple : true }} 
                        removalPredicate={(a, b) => a.name != b.name} 
                        getLabel={(x) => x.name}
                        ComponentItem={ListDropdownItem}
                        ExtraProps={{subItems : (x) => x.members.flatMap(x => x.name)}}/>}
                    </div>
                    {selectedTeams.length > 0 && <button onClick={removeTeams}>Remove</button>}
                </div>
                <button onClick={() => transition({nextStep : 'SetStages', participants : teams, particpantType : 'Team'})}>Continue</button>
            </div>
        </li>
    )
}