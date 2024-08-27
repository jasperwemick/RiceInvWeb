import React, { useContext, useEffect, useState } from 'react'
import useAuth from '../../hooks/userAuth'
import GetUrl from '../../GetUrl'
import useAlert from '../../hooks/useAlert'
import { DayOverview } from './DayOverview'
import SchedulePopUpToggleContext from './context/SchedulePopUpToggleProvider'
import EventContext from './context/EventContextProvider'

export const CalendarDays = ({currentDay, changeCurrentDay, setEntryDate}) => {

    const { auth, setAuth }  = useAuth()

    const { alert, setAlert } = useAlert()

    const { 
        toggleTimeEntry, setToggleTimeEntry, 
        toggleDayOverview, setToggleDayOverview, 
        monthlyTimeEntries, setMonthlyTimeEntries, 
        toggleTimeOverview, setToggleTimeOverview 
    } = useContext(SchedulePopUpToggleContext)

    const { events, setSelectedDayEvents } = useContext(EventContext)

    const today = new Date()
    
    useEffect(() => {

        if (auth.user) {

            const getMonthTimes = async () => {

                const res = await fetch(`${GetUrl}/api/events/time/${auth.user}/${currentDay.getFullYear()}/${'0' + String(currentDay.getMonth() + 1)}/borders`)
                let entries = await res.json()

                

                console.log(entries)
                setMonthlyTimeEntries(entries)
            }

            getMonthTimes()
        }

    }, [auth.user, currentDay, toggleTimeEntry])

    let firstDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays = [];
    for (let dayNum = 0; dayNum < 42; dayNum++) {

        if (dayNum === 0 && weekdayOfFirstDay === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
        } 
        else if (dayNum === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (dayNum - weekdayOfFirstDay));
        } 
        else {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }

        const calendarDay = {
            currentMonth: (firstDayOfMonth.getMonth() === currentDay.getMonth()),
            date: (new Date(firstDayOfMonth)),
            month: firstDayOfMonth.getMonth(),
            number: firstDayOfMonth.getDate(),
            selected: (firstDayOfMonth.toDateString() === currentDay.toDateString()),
            year: firstDayOfMonth.getFullYear()
        }

        currentDays.push(calendarDay);
    }
  
    return (
        <div className="table-content">
            {
                currentDays.map((calDay, index) => {

                    let dayEventList = events.filter((vnt) => vnt.day === calDay.number && vnt.month - 1 === calDay.month && vnt.year === calDay.year)
                    let timeEntryProvided = monthlyTimeEntries.find(({ day, month, year }) => (
                            day === calDay.number && month === calDay.month + 1 && year === calDay.year && currentDay.getMonth() === month - 1))

                    return (
                    <div 
                    className={`calendar-day ${calDay.currentMonth ? "current" : ""} ${calDay.selected ? " selected" : ""}`}
                    key={index}
                    onClick={() => {
                        if (calDay.date.getDate() === currentDay.getDate() && calDay.date.getMonth() === currentDay.getMonth()) {
                            setEntryDate(calDay.date)
                            setSelectedDayEvents(dayEventList); 
                            setToggleDayOverview(!toggleDayOverview); 
                        }
                        changeCurrentDay(calDay)
                    }}
                    style={ timeEntryProvided ? {backgroundColor: 'green'} : null
                    }>
                            
                        <p className='no-select-text'>{calDay.number}</p>
                        <div style={{display:'flex', justifyContent:'space-evenly'}}>
                            <button 
                            className='toggle-time-entry-button'
                            style={
                                (auth.user && (
                                    (calDay.month === today.getMonth() || calDay.month === (today.getMonth() === 11 ? 0 : today.getMonth() + 1)) && 
                                    today.getFullYear() === calDay.year)
                                ) ? 
                                null : 
                                {visibility: 'hidden', pointerEvents: 'none'}
                            } 
                            onClick={
                                auth.user ? 
                                (e) => {
                                    setToggleTimeEntry(true)
                                    setEntryDate(calDay.date)
                                    e.stopPropagation()
                                } : 
                                (e) => { 
                                    setAlert({active: true, message: 'Please Log In'}) 
                                    e.stopPropagation()
                                } 
                            }>
                            {`${timeEntryProvided ? `Update` : `Add`}`}
                            </button>
                            <button
                            className={`toggle-time-entry-button`}
                            style={
                                (auth.user && (auth.roles ? auth.roles.includes('Admin') : false)) ?
                                null :
                                {visibility: 'hidden', pointerEvents: 'none'}
                            }
                            onClick={
                                (e) => {
                                    setToggleTimeOverview(true)
                                    setEntryDate(calDay.date)
                                    e.stopPropagation()
                                }
                            }
                            >
                            {`Overview`}
                            </button>
                        </div>
                        <div 
                        className='calendar-event-blob' 
                        style={dayEventList.length === 0 ? {visibility: 'hidden', pointerEvents: 'none'} : null}>
                            <p className='no-select-text'>{`${dayEventList.length} Event(s)`}</p>
                        </div>

                    </div>
                    )
                })
            }
        </div>
    )
}
