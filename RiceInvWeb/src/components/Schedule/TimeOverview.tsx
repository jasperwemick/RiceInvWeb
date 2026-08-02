import React, { useState, useEffect, useContext } from "react";
import type { Dispatch, SetStateAction } from 'react';
import GetUrl from "../../util/GetUrl";
import TimeInterval from "./TimeInterval";
import type { TimeEntry, TimeEntryConfig, TimeIntervalData } from "../../data/types";
import useSchedulePopUp from "./hooks/useSchedulePopUp";
import apiFetch from "../../util/fetch";

interface TimeEntryDisplayProps {
    intervalData : TimeIntervalData[];
    config : TimeEntryConfig;
    stateFunction : Dispatch<SetStateAction<number>>;
}

const TimeEntryDisplay = ({intervalData, config, stateFunction} : TimeEntryDisplayProps) => {

    return (
        <div className={`time-entry-container`} style={config.rangeType !== 'BOTH' ? {opacity: config.opacity, width: 140} : {opacity: config.opacity}}>
            {
                intervalData.map((interval, index) => {
                    return (
                        <TimeInterval 
                            index={index} 
                            intervalData={interval}
                            key={index}
                            laterHalf={config.rangeType === 'PM'}
                            toggleRange={stateFunction}/>
                    )
                })
            }
        </div>
    )
}

export const TimeOverview = ({ date } : { date : Date }) => {

    const { toggleTimeOverview, setToggleTimeOverview } = useSchedulePopUp()

    const initEmptyRange = () : TimeIntervalData[] => {
        return Array.from({ length : 48 }, () => ({ strength: 0, players: [] }))
    }
    
    const [prevPMIntervalData, setPrevPMIntervalData] = useState<TimeIntervalData[]>(initEmptyRange())
    const [timeInvervalData, setTimeIntervalData] = useState<TimeIntervalData[]>(initEmptyRange())
    const [nextAMIntervalData, setNextAMIntervalData] = useState<TimeIntervalData[]>(initEmptyRange())

    const [currentIndex, setCurrentIndex] = useState<number>(-1)
    const [entrants, setEntrants] = useState<string[]>([])

    const dateFormatted = date.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3/$1/$2')

    useEffect(() => {

        const getTimeEntries = async () => {
            const entries = await apiFetch<TimeEntry[]>(`${GetUrl}/api/events/time/all/${date.getFullYear()}/${'0' + String(date.getMonth() + 1)}/${date.getDate()}`);

            console.log(entries)
            const todaysEntries = entries.filter((entry : TimeEntry) => entry.day === date.getDate())

            const numEntries = todaysEntries.length

            let mergedEntries = initEmptyRange();

            if (numEntries) {
                let newArr = mergedEntries.map((interval, index) => {

                    let temp = { ...interval }
                    
                    todaysEntries.forEach((entry : TimeEntry) => {
                        if (entry.timeRange[index]) {
                            temp.strength += 1
                            temp.players.push(entry.user)
                        }
                    })
    
                    temp.strength /= numEntries

                    return temp
                })


                setEntrants(todaysEntries.map((x) => x.user))
                setTimeIntervalData(newArr)
                return
            }

            setEntrants([])
            setTimeIntervalData(mergedEntries)
        }

        if (toggleTimeOverview) {
            getTimeEntries()
        }

    }, [toggleTimeOverview])

    const showAll = () => {
        return entrants.map((player, index) => {

            if (currentIndex !== -1) {
                return (
                    <li key={index} style={timeInvervalData[currentIndex].players.includes(player) ? {backgroundColor: 'forestgreen'} : {backgroundColor: 'darkred'}}>{player}</li>
                )
            }
            return (
                <li key={index}>{player}</li>
            )
        })
    }

    return (
        <div className={`time-entry-window`} style={toggleTimeOverview ? undefined : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Previous Day`}</p>
                <TimeEntryDisplay intervalData={prevPMIntervalData.slice(24)} config={{rangeType: 'PM', opacity: 0.4}} stateFunction={setCurrentIndex}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Selected Day: ${date.toLocaleDateString()}`}</p>
                <TimeEntryDisplay intervalData={timeInvervalData} config={{rangeType: 'BOTH', opacity: 1.0}} stateFunction={setCurrentIndex}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Next Day`}</p>
                <TimeEntryDisplay intervalData={nextAMIntervalData.slice(0, 24)} config={{rangeType: 'AM', opacity: 0.4}} stateFunction={setCurrentIndex}/>
            </div>
            <div className={`time-entry-text`}>
                <p>{`${currentIndex > 0 ? timeInvervalData[currentIndex].players.length : 0} / ${entrants.length} Available`}</p>
                <ul className={`time-overview-player-list`}>{showAll()}</ul>
                <button 
                style={{width: 60, height: 60, position: 'relative'}}
                onClick={() => {
                    setToggleTimeOverview(false);
                    setTimeIntervalData(initEmptyRange());
                    }}>
                    {`Exit`}
                </button>
            </div>
        </div>
    )
}