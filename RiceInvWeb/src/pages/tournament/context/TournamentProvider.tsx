import { createContext, type ReactNode, useState } from "react";
import useGetRef from "../../../hooks/useGetRef";

export interface TournamentContextProps {
    stepRef : (idx: number) => React.RefObject<HTMLLIElement>;
    sideStepRef : (idx: number) => React.RefObject<HTMLLIElement>;
    animInProgress : boolean;
    setAnimInProgress : React.Dispatch<React.SetStateAction<boolean>>;
}

const TournamentContext = createContext<TournamentContextProps | null>(null);

export const TournamentProvider = ({ children } : { children : ReactNode }) => {

    const [animInProgress, setAnimInProgress] = useState<boolean>(false);

    const stepRef = useGetRef<HTMLLIElement>();
    const sideStepRef = useGetRef<HTMLLIElement>();
    
    return (
        <TournamentContext.Provider value={{stepRef, sideStepRef, animInProgress, setAnimInProgress}}>
            {children}
        </TournamentContext.Provider>
    )
}

export default TournamentContext;