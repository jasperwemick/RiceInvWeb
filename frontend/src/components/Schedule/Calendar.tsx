import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CalendarDays } from './CalendarDays'
import { CalendarDay } from '../../data/types'



export const Calendar = ({setEntryDate} : {setEntryDate : Dispatch<SetStateAction<Date>>}) => {

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']

    const [currentDay, setCurrentDay] = useState(new Date())

    const changeCurrentDay = (day : CalendarDay) => {
        setCurrentDay(new Date(day.year, day.month, day.number))
    }

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2 className='no-select-text'>{months[currentDay.getMonth()]} {currentDay.getFullYear()}</h2>
            </div>
            <div className="calendar-body">
                <div className="table-header">
                {
                    weekdays.map((weekday, index) => {
                        return (
                            <div className="weekday" key={index}><p className='no-select-text'>{weekday}</p></div>
                        )
                    })
                }
                </div>
                <CalendarDays 
                    currentDay={currentDay} 
                    changeCurrentDay={changeCurrentDay} 
                    setEntryDate={setEntryDate} />
            </div>
        </div>
    )
}