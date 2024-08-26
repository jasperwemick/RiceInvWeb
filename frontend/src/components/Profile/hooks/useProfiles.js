import { useContext, useEffect } from 'react'
import ProfileContext from "../context/ProfileContextProvider"
import { parseISO, addSeconds } from 'date-fns'
import GetUrl from '../../../GetUrl'


const useProfiles = () => {

    const { profiles, setProfiles } = useContext(ProfileContext)

    useEffect(() => {

        async function getProfiles(path) {
            try {
                const response = await fetch(`${GetUrl}/api/profiles/${path}`);
                const jsponse = await response.json();

                const merge = jsponse.map((jprof) => {
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
            const params = new Proxy(new URLSearchParams(profiles[0].imageUrl), {
                get: (searchParams, prop) => searchParams.get(prop),
            });
            const creationDate = parseISO(params['X-Amz-Date']);
            const expiresInSecs = Number(params['X-Amz-Expires']);

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
}

export default useProfiles;