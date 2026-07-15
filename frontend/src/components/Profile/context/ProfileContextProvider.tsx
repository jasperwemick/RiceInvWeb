import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Profile } from "../../../data/types";


export interface ProfileContextType {
    profiles : Profile[];
    setProfiles : Dispatch<SetStateAction<Profile[]>>;
}

export const ProfileContext = createContext<ProfileContextType | null>(null)

export const ProfileContextProvider = ({children} : { children : ReactNode }) => {

    const [profiles, setProfiles] = useState<Profile[]>([])

    return (
        <ProfileContext.Provider value={{ profiles, setProfiles }}>
            {children}
        </ProfileContext.Provider>
    )
}