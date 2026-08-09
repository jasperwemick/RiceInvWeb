import { useEffect, useState, type RefObject } from "react";
import apiFetch from "../../../util/fetch";
import type { Profile } from "../../../data/types";
import useGetRef from "../../../hooks/useGetRef";

interface AddParticipantsData {
    participants : Profile[];
}

interface CreateStartProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : AddParticipantsData) => void;
    animInProgress : boolean;
}



export default function AddParticipants({ itemRef, transition, animInProgress } : CreateStartProps) {

    const [participants, setParticipants] = useState<Profile[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const getRef = useGetRef<HTMLDivElement>();

    useEffect(() => {

        const getPlayers = async () =>  {
            try {
                setProfiles(await apiFetch<Profile[]>('/api/profiles/noimg'));
            }
            catch(e) {
                console.log('Failed to fetch: ', e);
            }
        }

        getPlayers();
    }, []);

    const toggleParticipant = (profile : Profile, index : number) => {
        const item = getRef(index).current;
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            setParticipants(participants.filter(x => x._id != profile._id))
            return;
        }
        item.classList.add('selected');
        setParticipants([...participants, profile]);
    }

    const mapProfileNames = () => {
        return profiles.map((profile, i) => {
            return (
                <div key={i} ref={getRef(i)} onClick={() => toggleParticipant(profile, i)}>{profile.name}</div>
            )
        })
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Who is participating?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-participants-grid'}>
                    {!animInProgress && mapProfileNames()}
                </div>
                <button onClick={() => transition({ participants : participants })}>Continue</button>
            </div>
        </li>
    )
}
