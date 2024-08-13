import React, { useContext, useEffect, useState } from 'react'
import SchedulePopUpToggleContext from './context/SchedulePopUpToggleProvider'
import EventContext from './context/EventContextProvider'

export const DayOverview = ({date}) => {

    const { selectedDayEvents, setCurrentEvent } = useContext(EventContext)
    
    const { toggleEventInfo, setToggleEventInfo, toggleDayOverview, setToggleDayOverview } = useContext(SchedulePopUpToggleContext)

    const mapEvents = () => {
        return (
            selectedDayEvents.map((vnt, index) => {
                return (
                    <li key={index}>
                        <div 
                        key={index} 
                        className='calendar-event' 
                        onClick={() => {
                            setToggleDayOverview(false)
                            setToggleEventInfo(true)
                            setCurrentEvent(vnt)
                        }}>
                            <p className='no-select-text'>{vnt.name}</p>
                            <p className='no-select-text'>{vnt.description}</p>
                        </div>                        
                    </li>
                )
            })
        )
    }

    return (
        <div className={`time-entry-window`} style={toggleDayOverview ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div>
                <p>{`Events: `}</p>
                <ul className='calendar-event-list'>{mapEvents()}</ul>
            </div>
            <div>
                <p>{`Date: ${date.toLocaleDateString()}`}</p>
            </div>
            <button style={{width: 30, height: 30}} onClick={() => {setToggleDayOverview(false)}}>{`Exit`}</button>
        </div>
    )
}