import React, { useState, useEffect, useContext } from "react";
import useAuth from "../../hooks/userAuth";
import GetUrl from "../../GetUrl";
import { TimeEntry } from "./TimeEntry";
import SchedulePopUpToggleContext from "./context/SchedulePopUpToggleProvider";

export const TimeEditor = ({ date }) => {

    const [timeInvervalData, setTimeIntervalData] = useState(Array(48).fill(false))

    const { auth, setAuth } = useAuth()

    const dateFormatted = date.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3/$1/$2')

    const { toggleTimeEntry, setToggleTimeEntry } = useContext(SchedulePopUpToggleContext)

    useEffect(() => {

        const getTimeData = async () => {

            try {
                const timeResponse = await fetch(`${GetUrl}/api/events/time/${auth.user ? auth.user : `none`}/${dateFormatted}`)
                const jTimeResponse = await timeResponse.json()
    
                if (jTimeResponse) {
                    setTimeIntervalData(jTimeResponse.timeRange)
                }
            }
            catch(e) {
                console.log(`Failed to fetch: ${e}`)
            }
        }

        if (toggleTimeEntry) {
            getTimeData()
        }

    }, [toggleTimeEntry])

    const submitTime = () => {

        const dateSplit = dateFormatted.split('/')

        const submissionData = {
            user: auth.user,
            profileId: auth.profile ? auth.profile._id : '',
            year: dateSplit[0],
            month: dateSplit[1],
            day: dateSplit[2],
            timeRange: timeInvervalData
        }

        const putTime = async () => {

            try {
                await fetch(`${GetUrl}/api/events/time/${auth.user ? auth.user : `none`}/${dateFormatted}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submissionData)
                })
                setToggleTimeEntry(false)
                setTimeIntervalData(Array(48).fill(false))
            }
            catch(e) {
                console.log(`Failed to fetch (PUT): ${e}`)
            }
        }

        putTime()
        
    }

    return (
        <div className={`time-entry-window`} style={toggleTimeEntry ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
            <TimeEntry timeInvervalData={timeInvervalData} setTimeIntervalData={setTimeIntervalData}/>
            <div>
                <div >{` Date: ${date.toLocaleDateString()} `}</div>
                <div>{` Name: ${auth.profile ? auth.profile.name : ''} `}</div>
                <button style={{width: 60, height: 60}} onClick={() => auth.user ? submitTime() : console.log('Please log in')}/>
            </div>
        </div>
    )
}