import React, { useState, useEffect, useContext } from "react";
import useAuth from "../../hooks/useAuth";
import GetUrl from "../../GetUrl";
import TimeEntry from "./TimeEntry";
import TimeInterval from "./TimeInterval";
import useSchedulePopUp from "./hooks/useSchedulePopUp";
import { TimeEntryConfig } from "../../data/types";

interface ThreeDayEntry {
    prev : boolean[];
    current : boolean[];
    next : boolean[];
}

interface TimeEntryDisplayProps {
    intervalData : boolean[];
    config : TimeEntryConfig;
}

const TimeEntryDisplay = ({ intervalData, config } : TimeEntryDisplayProps) => {
    return (
        <div className={`time-entry-container`} style={config.rangeType !== 'BOTH' ? {opacity: config.opacity, width: 140} : {opacity: config.opacity}}>
            {
                intervalData.map((interval, index : number) => {
                    return (
                        <TimeInterval 
                            index={index} 
                            intervalData={interval}
                            key={index}
                            laterHalf={config.rangeType === 'PM'}/>
                    )
                })
            }
        </div>
    )
}

export default function TimeEditor({ date } : { date : Date }) {

    const findEntry = (dayNum : number) : boolean[] => {
        const entry = monthlyTimeEntries.find((x) => x.day === dayNum)
        return (entry ? entry.timeRange : Array(48).fill(false))
    }

    const { toggleTimeEntry, setToggleTimeEntry, monthlyTimeEntries } = useSchedulePopUp()

    const [prevPMIntervalData, setPrevPMIntervalData] = useState(findEntry(date.getDate() - 1))
    const [timeInvervalData, setTimeIntervalData] = useState(findEntry(date.getDate()))
    const [nextAMIntervalData, setNextAMIntervalData] = useState(findEntry(date.getDate() + 1))

    const [eastAlignment, setEastAlignment] = useState(0)

    const { auth, setAuth } = useAuth()

    const dateFormatted = date.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3/$1/$2')

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // https://stackoverflow.com/questions/20712419/get-utc-offset-from-timezone-in-javascript
    const getOffset = (timeZone : string) => {
        
        const timeZoneName = Intl.DateTimeFormat(
            "ia", 
            {
                timeZoneName: "shortOffset",
                timeZone,
            }
        ).formatToParts().find((i) => i.type === "timeZoneName")?.value

        if (!timeZoneName) {
            throw new Error('Cannot determine timezone');
        }
        
        const offset = timeZoneName.slice(3)
        if (!offset) return 0;
      
        const matchData = offset.match(/([+-])(\d+)(?::(\d+))?/)
        if (!matchData) throw `cannot parse timezone name: ${timeZoneName}`
      
        const [, sign, hour, minute] = matchData
        let result = parseInt(hour) * 60
        if (sign === "+") result *= -1
        if (minute) result += parseInt(minute)
      
        return result
    }

    useEffect(() => {
    
        if (toggleTimeEntry) {
            const prevEntry = findEntry(date.getDate() - 1)
            setPrevPMIntervalData(prevEntry)
            const currentEntry = findEntry(date.getDate())
            setTimeIntervalData(currentEntry)
            const nextEntry = findEntry(date.getDate() + 1)
            setNextAMIntervalData(nextEntry)

            const alignment = getOffset(timezone) - 240
            console.log(alignment)
            alignTime(alignment * -1, alignment, {prev: prevEntry, current: currentEntry, next: nextEntry})
        }

    }, [toggleTimeEntry])

    useEffect(() => {

    }, [])

    const alignTime = (alignment : number, setAlignmentTo : number, entries : ThreeDayEntry) => {
        const shift = 2 * (alignment / 60)

        if (shift === 0) {
            setEastAlignment(0)
            return
        }

        const prevShiftChunk = entries.prev.slice(Math.abs(shift) * -1, 48)
        const nextShiftChunk = entries.next.slice(0, Math.abs(shift))

        const alignedTime = prevShiftChunk.concat(entries.current.concat(nextShiftChunk))

        const offset = shift < 0 ? 2 * Math.abs(shift) : 0

        if (offset === 0) {
            // Shift prev and next times forwards by shift amount ex: pst -> est
            setPrevPMIntervalData(Array(Math.abs(shift)).fill(false).concat(entries.prev.slice(0, 48 - Math.abs(shift))))
            setNextAMIntervalData(entries.current.slice(48 - Math.abs(shift), 48).concat(entries.next.slice(0, 48 - Math.abs(shift))))
        }
        else {
            // Move time backwards by shift ex: est -> pst
            setPrevPMIntervalData(entries.prev.slice(Math.abs(shift), 48).concat(entries.current.slice(0, Math.abs(shift))))
            setNextAMIntervalData(entries.next.slice(Math.abs(shift), 48).concat(Array(Math.abs(shift)).fill(false)))
        }

        setTimeIntervalData(alignedTime.slice(offset, 48 + offset))
        
        setEastAlignment(setAlignmentTo)
    }

    const submitTime = () => {

        const dateSplit = dateFormatted.split('/')

        if (!auth) {
            throw new Error('Illegal login');
        }

        const submissionData = {
            user: auth.username,
            profileId: auth.profileId,
            year: dateSplit[0],
            month: dateSplit[1],
            day: dateSplit[2],
            timeRange: timeInvervalData
        }

        const putTime = async () => {

            try {
                await fetch(`${GetUrl}/api/events/time/${auth.username}/${dateFormatted}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
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
        <div className={`time-entry-window`} style={toggleTimeEntry ? undefined : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Previous Day`}</p>
                <TimeEntryDisplay intervalData={prevPMIntervalData.slice(24)} config={{rangeType: 'PM', opacity: 0.4}}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Selected Day: ${date.toLocaleDateString()}`}</p>
                <TimeEntry timeIntervalData={timeInvervalData} setTimeIntervalData={setTimeIntervalData}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Next Day`}</p>
                <TimeEntryDisplay intervalData={nextAMIntervalData.slice(0, 24)} config={{rangeType: 'AM', opacity: 0.4}}/>
            </div>
            <div className={`time-entry-text`}>
                <p className="no-select-text">{`Your Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}</p>
                <p 
                className="no-select-text" 
                onClick={() => eastAlignment !== 0 ? 
                    alignTime(
                        eastAlignment,
                        0, 
                        {prev: prevPMIntervalData, current: timeInvervalData, next: nextAMIntervalData}
                    ) : console.log('no')
                }
                style={eastAlignment === 0 ? {backgroundColor: 'forestgreen'} : {backgroundColor: 'darkred'}}>
                    {eastAlignment === 0 ? `Aligned with EST` : `Click to Align with EST`}
                </p>
                <p className="no-select-text">{` User: ${auth?.username} `}</p>
                <button style={{width: 60, height: 60}} onClick={() => (auth?.username && eastAlignment === 0) ? submitTime() : console.log('Time not EST')}>
                    {`Submit Time`}
                </button>
                <button 
                style={{width: 60, height: 60, position: 'relative'}}
                onClick={() => {
                    setToggleTimeEntry(false)
                    setTimeIntervalData(Array(48).fill(false))
                    }}>
                    {`Exit`}
                </button>
            </div>
        </div>
    )
}