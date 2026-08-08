import { useEffect, useState } from "react"


function ConfigBox({ step, setStep } : { step : string, setStep : React.Dispatch<React.SetStateAction<string>>}) {

    const NextStep = () => {
        setStep('Next');
    }

    useEffect(() => {
        
    }, [step])

    return (
        <li className={'tournament-configuration-box'}>
            <div className={'tournament-configuration-box-header'}>
                <p>Enter a name for the tournament</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <input/>
                <button onClick={NextStep}>Continue</button>
            </div>
        </li>
    )
}


export default function CreateTournamentPage() {

    const [step, setStep] = useState<string>('Start');

    return (
        <div className={'tournament-create'}>
            <ul className={'tournament-illusion-list'}>
                <ConfigBox step={step} setStep={setStep}/>
            </ul>
        </div>
    )
}