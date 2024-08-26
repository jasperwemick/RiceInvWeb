import { createContext, useState } from "react";

const ProfileContext = createContext({})

export const ProfileContextProvider = ({children}) => {

    const [profiles, setProfiles] = useState([])

    return (
        <ProfileContext.Provider value={{profiles, setProfiles}}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;