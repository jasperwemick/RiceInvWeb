import { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"
import type { Tournament } from "../../data/types";
import CreateStart from "./components/createStart";
import useGetRef from "../../hooks/useGetRef";
import AddParticipants from "./components/addParticipants";
import SetTeams from "./components/setTeams";


export default function CreateTournamentPage() {

    const [step, setStep] = useState<number>(0);
    const [tournament, setTournament] = useState<Tournament | null>(null);

    const [animInProgress, setAnimInProgress] = useState<boolean>(false);

    const listRef = useRef<HTMLUListElement | null>(null);
    const getRef = useGetRef<HTMLLIElement>();

    const onAdd = (item : HTMLLIElement) => {
        item.classList.remove('active');
        setAnimInProgress(false);
    }

    const onRemove = () => {
        setStep(step + 1);
        setAnimInProgress(false);
    }

    useEffect(() => {
        const item = getRef(step).current;
        if (item) {
            item.classList.add('active');
            setAnimInProgress(true);
            setTimeout(() => {
                onAdd(item);
            }, 900);
        }
    }, [step])

    const NextStep = (data) => {
        const item = getRef(step).current;
        if (item) {
            item.classList.add('exiting');
            setAnimInProgress(true);
            setTimeout(() => {
                onRemove();
            }, 900);
        }
    }

    const SideStep = (data) => {
        const item = getRef(step).current;
        if (item) {
            item.classList.add();
        }
    }

    return (
        <div className={'tournament-create'}>
            <ul className={'tournament-illusion-list'} ref={listRef}>
                {step === 0 && <CreateStart itemRef={getRef(0)} transition={NextStep}/>}
                {step === 1 && <AddParticipants itemRef={getRef(1)} transition={NextStep} animInProgress={animInProgress}/>}
                {step === 2 && <SetTeams itemRef={getRef(2)} transition={NextStep}/>}
            </ul>
        </div>
    )
}