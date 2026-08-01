import React, { useContext, useEffect, useState } from 'react'
import useRiceEvent from './hooks/useRiceEvent'
import useSchedulePopUp from './hooks/useSchedulePopUp'

export const DayOverview = ({date} : { date : Date }) => {

    const { selectedDayEvents, setCurrentEvent } = useRiceEvent()
    
    const { toggleEventInfo, setToggleEventInfo, toggleDayOverview, setToggleDayOverview } = useSchedulePopUp();

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
        <div className={`time-entry-window`} style={toggleDayOverview ? undefined : {visibility: 'hidden', pointerEvents: 'none'}}>
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