import { useContext, useEffect } from 'react'
import { parseISO, addSeconds } from 'date-fns'
import GetUrl from '../../../util/GetUrl'
import { ProfileContext } from '../context/ProfileContextProvider'
import type { Path } from 'wouter';
import apiFetch from '../../../util/fetch';
import type { Profile } from '../../../data/types';


export default function useProfiles() {

    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('Profiles Not Available');
    }
    const { profiles, setProfiles } = context

    useEffect(() => {

        async function getProfiles(path : Path) {
            try {
                const jsponse = await apiFetch<Profile[]>(`${GetUrl}/api/profiles/${path}`);

                const merge = jsponse.map((jprof : Profile) => {
                    const localMatch = profiles.find((x) => x._id === jprof._id)
                    return {...localMatch, ...jprof }
                })

                setProfiles(merge)
            }
            catch(e) {
                const message = `An error occurred: ${e}`;
                console.log(message)
                return;
            }
        }

        if (profiles.length === 0) {
            getProfiles('default');
        }
        else {
            // get the query params: https://stackoverflow.com/a/901144/9362404
            const params = new Proxy(new URLSearchParams(profiles[0].imageURL), {
                get: (searchParams, prop) => searchParams.get(String(prop)),
            });
            const date = params.get('X-Amz-Date')
            if (!date) {
                getProfiles('default/noimg')
                throw new Error("Image date validation failed")
            }
            const creationDate = parseISO(date);
            const expiresInSecs = Number(params.get('X-Amz-Expires'));

            const expiryDate = addSeconds(creationDate, expiresInSecs);
            const isExpired = expiryDate < new Date();

            if (isExpired) {
                getProfiles('default')
            }
            else {
                getProfiles('default/noimg')
            }
        }   
    }, [])

    return context;
}