import { useContext } from 'react'
import { ProfileContext } from '../context/ProfileContextProvider'


export default function useProfiles() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('Profiles Not Available');
    }
    return context;
}