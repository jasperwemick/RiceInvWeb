import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/userAuth'
import GetUrl from '../../GetUrl'
import useAlert from '../../hooks/useAlert'

export const CalendarDays = ({day, changeCurrentDay, timeToggle, timeToggleStatus, setEntryDate, events}) => {

    const [monthTimeStatus, setMonthTimeStatus] = useState([])

    const { auth, setAuth }  = useAuth()

    const { alert, setAlert } = useAlert()
    
    useEffect(() => {

        if (auth.user) {

            const getMonthTimes = async () => {

                const res = await fetch(`${GetUrl}/api/events/time/${auth.user}/${day.getFullYear()}/${'0' + String(day.getMonth() + 1)}`)
                const jres = await res.json()

                console.log(jres)
                setMonthTimeStatus(jres)
            }

            getMonthTimes()
        }

    }, [auth.user, day, timeToggleStatus])

    let firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
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
            currentMonth: (firstDayOfMonth.getMonth() === day.getMonth()),
            date: (new Date(firstDayOfMonth)),
            month: firstDayOfMonth.getMonth(),
            number: firstDayOfMonth.getDate(),
            selected: (firstDayOfMonth.toDateString() === day.toDateString()),
            year: firstDayOfMonth.getFullYear()
        }

        currentDays.push(calendarDay);
    }
  
    return (
        <div className="table-content">
            {
                currentDays.map((calDay, index) => {
                    return (
                    <div className={`calendar-day ${calDay.currentMonth ? "current" : ""} ${calDay.selected ? " selected" : ""}`}
                        key={index}
                        onClick={() => changeCurrentDay(calDay)}
                        style={monthTimeStatus.find(({ day, month, year }) => (
                            day === calDay.number && month === calDay.month + 1 && year === calDay.year)) ? 
                            {backgroundColor: 'green'} : null
                        }>
                            
                        <p className='no-select-text'>{calDay.number}</p>
                        <button style={{width: 30, height: 30, position: 'relative'}} onClick={
                            auth.user ? () => {
                                timeToggle(!timeToggleStatus); 
                                setEntryDate(calDay.date);
                            } : () => { setAlert({active: true, message: 'Please Log In'}) } }
                        />
                        <div style={{display: 'flex'}}>
                        {
                            events.filter((vnt) => vnt.day === calDay.number && vnt.month - 1 === calDay.month && vnt.year === calDay.year).map((vnt, index) => {
                                return (
                                    <div key={index} className='calendar-event' onClick={() => null /* Show event details, add button on popup to lead to editor*/}>
                                        <p className='no-select-text'>{vnt.name}</p>
                                        <p></p>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                    )
                })
            }
        </div>
    )
}
