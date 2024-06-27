import React, { useEffect, useState } from 'react'
import { CalendarDays } from './CalendarDays'
import '../../style/calendar.css'

export const Calendar = ({timeToggle, timeToggleStatus, setEntryDate, eventToggle, eventToggleStatus}) => {

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']

    const [currentDay, setCurrentDay] = useState(new Date())

    const changeCurrentDay = (day) => {
        setCurrentDay(new Date(day.year, day.month, day.number))
    }

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2>{months[currentDay.getMonth()]} {currentDay.getFullYear()}</h2>
            </div>
            <div className="calendar-body">
                <div className="table-header">
                {
                    weekdays.map((weekday, index) => {
                        return (
                            <div className="weekday" key={index}><p>{weekday}</p></div>
                        )
                    })
                }
                </div>
                <CalendarDays 
                    day={currentDay} 
                    changeCurrentDay={changeCurrentDay} 
                    timeToggle={timeToggle} 
                    timeToggleStatus={timeToggleStatus} 
                    eventToggle={eventToggle} 
                    eventToggleStatus={eventToggleStatus} 
                    setEntryDate={setEntryDate}/>
            </div>
        </div>
    )
}