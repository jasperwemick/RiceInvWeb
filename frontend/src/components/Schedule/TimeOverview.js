import React, { useState, useEffect, useContext } from "react";
import GetUrl from "../../GetUrl";
import { TimeInterval } from "./TimeInterval";
import SchedulePopUpToggleContext from "./context/SchedulePopUpToggleProvider";

const TimeEntryDisplay = ({intervalData, config, stateFunction}) => {

    return (
        <div className={`time-entry-container`} style={config.show !== 'BOTH' ? {opacity: config.opacity, width: 140} : {opacity: config.opacity}}>
            {
                intervalData.map((interval, index) => {
                    return (
                        <TimeInterval 
                            index={index} 
                            intervalData={interval}
                            key={index}
                            laterHalf={config.show === 'PM'}
                            toggleRange={stateFunction}/>
                    )
                })
            }
        </div>
    )
}

export const TimeOverview = ({ date }) => {

    const { toggleTimeOverview, setToggleTimeOverview } = useContext(SchedulePopUpToggleContext)

    const [prevPMIntervalData, setPrevPMIntervalData] = useState(Array(48).fill().map((_) => ({ strength: 0, players: [] })))
    const [timeInvervalData, setTimeIntervalData] = useState(Array(48).fill().map((_) => ({ strength: 0, players: [] })))
    const [nextAMIntervalData, setNextAMIntervalData] = useState(Array(48).fill().map((_) => ({ strength: 0, players: [] })))

    const [currentIndex, setCurrentIndex] = useState(-1)
    const [entrants, setEntrants] = useState([])

    const dateFormatted = date.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3/$1/$2')

    useEffect(() => {

        const getTimeEntries = async () => {
            const res = await fetch(`${GetUrl}/api/events/time/all/${date.getFullYear()}/${'0' + String(date.getMonth() + 1)}/${date.getDate()}`)
            const entries = await res.json()

            console.log(entries)
            const todaysEntries = entries.filter((entry) => entry.day === date.getDate())

            const numEntries = todaysEntries.length

            let mergedEntries = Array(48).fill().map((_) => ({ strength: 0, players: [] }))

            if (numEntries) {
                let newArr = mergedEntries.map((interval, index) => {

                    let temp = { ...interval }
                    
                    todaysEntries.forEach((entry) => {
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
        <div className={`time-entry-window`} style={toggleTimeOverview ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Previous Day`}</p>
                <TimeEntryDisplay intervalData={prevPMIntervalData.slice(24)} config={{show: 'PM', opacity: 0.4}} stateFunction={setCurrentIndex}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Selected Day: ${date.toLocaleDateString()}`}</p>
                <TimeEntryDisplay intervalData={timeInvervalData} config={{show: 'BOTH', opacity: 1.0}} stateFunction={setCurrentIndex}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{`Next Day`}</p>
                <TimeEntryDisplay intervalData={nextAMIntervalData.slice(0, 24)} config={{show: 'AM', opacity: 0.4}} stateFunction={setCurrentIndex}/>
            </div>
            <div className={`time-entry-text`}>
                <p>{`${currentIndex > 0 ? timeInvervalData[currentIndex].players.length : 0} / ${entrants.length} Available`}</p>
                <ul className={`time-overview-player-list`}>{showAll()}</ul>
                <button 
                style={{width: 60, height: 60, position: 'relative'}}
                onClick={() => {
                    setToggleTimeOverview(false)
                    setTimeIntervalData(Array(48).fill().map((_) => ({ strength: 0, players: [] })))
                    }}>
                    {`Exit`}
                </button>
            </div>
        </div>
    )
}