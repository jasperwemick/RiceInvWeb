import React, { useContext, useEffect, useState } from 'react'
import SchedulePopUpToggleContext from './context/SchedulePopUpToggleProvider'
import EventContext from './context/EventContextProvider'

export const DayOverview = ({}) => {

    const { selectedDayEvents } = useContext(EventContext)
    
    const { toggleEventInfo, setToggleEventInfo, toggleDayOverview } = useContext(SchedulePopUpToggleContext)

    const mapEvents = () => {
        return (
            selectedDayEvents.map((vnt, index) => {
                return (
                    <li>
                        <div key={index} className='calendar-event' onClick={() => setToggleEventInfo(!toggleEventInfo)}>
                            <p className='no-select-text'>{vnt.name}</p>
                            <p></p>
                        </div>                        
                    </li>
                )
            })
        )
    }

    return (
        <div className={`time-entry-window`} style={toggleDayOverview ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div>
                <ul className='calendar-event-list'>{mapEvents()}</ul>
            </div>
        </div>
    )
}