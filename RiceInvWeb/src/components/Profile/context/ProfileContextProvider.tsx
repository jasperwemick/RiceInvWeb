import { createContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Profile } from "../../../data/types";
import apiFetch from "../../../util/fetch";
import type { Path } from "wouter";
import { addSeconds, parseISO } from "date-fns";


export interface ProfileContextType {
    profiles : Profile[];
    setProfiles : Dispatch<SetStateAction<Profile[]>>;
}

export const ProfileContext = createContext<ProfileContextType | null>(null)

export const ProfileContextProvider = ({children} : { children : ReactNode }) => {

    const [profiles, setProfiles] = useState<Profile[]>([])

    useEffect(() => {

        async function getProfiles(path : Path) {
            try {
                const jsponse = await apiFetch<Profile[]>(`/api/profiles${path}`);
                const merge = jsponse.map((jprof : Profile) => {
                    const localMatch = profiles.find((x) => x._id === jprof._id)
                    return {...localMatch, ...jprof }
                });
                console.log(jsponse);
                setProfiles(merge);
            }
            catch(e) {
                const message = `An error occurred: ${e}`;
                console.log(message)
                return;
            }
        }

        // Basically, reuse locally cached images if they've already been obtained from S3 in order to reduce calls to AWS
        // and give Jeff less money
        if (profiles.length === 0) {
            getProfiles('');
        }
        else {
            // get the query params: https://stackoverflow.com/a/901144/9362404
            const params = new URLSearchParams(profiles[0].imageUrl);
            const date = params.get('X-Amz-Date')
            if (!date) {
                getProfiles('/noimg')
                throw new Error("Image date validation failed")
            }
            const creationDate = parseISO(date);
            const expiresInSecs = Number(params.get('X-Amz-Expires'));

            const expiryDate = addSeconds(creationDate, expiresInSecs);
            const isExpired = expiryDate < new Date();

            if (isExpired) {
                getProfiles('')
            }
            else {
                getProfiles('/noimg')
            }
        }   
    }, [])

    return (
        <ProfileContext.Provider value={{ profiles, setProfiles }}>
            {children}
        </ProfileContext.Provider>
    )
}