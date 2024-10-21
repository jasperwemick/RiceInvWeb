import React, { createRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/userAuth'
import GetUrl from '../../GetUrl'
// import useAlert from '../../hooks/useAlert'
// import { DayOverview } from './DayOverview'
import SchedulePopUpToggleContext from './context/SchedulePopUpToggleProvider'
import EventContext from './context/EventContextProvider'

const useGetRef = () => {
    const refs = useRef({})
    return useCallback(
        (idx) => (refs.current[idx] ??= createRef()),
        [refs]
    )
}

export const CalendarDays = ({currentDay, changeCurrentDay, setEntryDate}) => {

    const { auth }  = useAuth()

    // const { setAlert } = useAlert() // RENDERING PROBLEM

    const getRef = useGetRef()
    const selectionRef = useRef(null)

    function downHandler({key}) {
        if (key === 'Shift') {
            setShiftHeld(true);
        }
    }

    function upHandler({key}) {
        if (key === 'Shift') {
            setShiftHeld(false);
        }
    }

    const { 
        toggleTimeEntry, setToggleTimeEntry, 
        toggleDayOverview, setToggleDayOverview, 
        monthlyTimeEntries, setMonthlyTimeEntries, 
        toggleTimeOverview, setToggleTimeOverview 
    } = useContext(SchedulePopUpToggleContext)

    const { events, setSelectedDayEvents } = useContext(EventContext)

    const [selectionBox, setSelectionBox] = useState({
        originalWidth: 0,
        topLeftDay: 0,
        width: 1,
        height: 1
    })

    const [currentDays, setCurrentDays] = useState([])
    const [shiftHeld, setShiftHeld] = useState(false);

    const today = new Date()

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
    
    useEffect(() => {

        if (auth.user) {

            const getMonthTimes = async () => {

                const res = await fetch(`${GetUrl}/api/events/time/${auth.user}/${currentDay.getFullYear()}/${'0' + String(currentDay.getMonth() + 1)}/borders`)
                let entries = await res.json()

                setMonthlyTimeEntries(entries)
            }

            getMonthTimes()
        }

    }, [auth.user, currentDay, toggleTimeEntry])

    useEffect(() => {
        let firstDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
        let weekdayOfFirstDay = firstDayOfMonth.getDay();
        let temp = [];
    
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
                dayNum: dayNum,
                currentMonth: (firstDayOfMonth.getMonth() === currentDay.getMonth()),
                date: (new Date(firstDayOfMonth)),
                month: firstDayOfMonth.getMonth(),
                number: firstDayOfMonth.getDate(),
                selected: (firstDayOfMonth.toDateString() === currentDay.toDateString()),
                year: firstDayOfMonth.getFullYear()
            }
    
            temp.push(calendarDay);
        }

        setCurrentDays(temp)
    }, [currentDay])

    const handleGridboxClick = (e) => {
        
    }

    const handleCalendarDayClick = (calDay, dayEventList) => {
        if (calDay.date.getDate() === currentDay.getDate() && calDay.date.getMonth() === currentDay.getMonth()) {
            setEntryDate(calDay.date)
            setSelectedDayEvents(dayEventList); 
            setToggleDayOverview(!toggleDayOverview); 
        }

        // Move selection box
        const bounds = getRef(calDay.dayNum).current.getBoundingClientRect()

        if (shiftHeld && selectionBox.originalWidth !== 0) {
            let width = Number(selectionRef.current.style.width.slice(0, -2))
            let left = Number(selectionRef.current.style.left.slice(0, -2))

            const startingWeekday = selectionBox.topLeftDay % 7
            const endingWeekday = calDay.dayNum % 7

            if (startingWeekday < endingWeekday) {
                const diff = endingWeekday - startingWeekday
                width = bounds.width * (diff + 1)
                setSelectionBox({ ...selectionBox, width: selectionBox.width + diff })
            }
            else if (startingWeekday > endingWeekday) {
                const diff = startingWeekday - endingWeekday
                left -= bounds.width * diff
                width += bounds.width * diff
                setSelectionBox({ ...selectionBox, topLeftDay: calDay.dayNum, width: selectionBox.width + diff })
            }
            else {
                width = bounds.width
            }
            
            selectionRef.current.style.width = String(width) + 'px'
            selectionRef.current.style.left = String(left) + 'px'            
        }
        else {
            selectionRef.current.style.left = String(bounds.left) + 'px'
            selectionRef.current.style.top = String(bounds.top) + 'px'
            selectionRef.current.style.width = String(bounds.width) + 'px'
            selectionRef.current.style.height = String(bounds.height) + 'px'

            changeCurrentDay(calDay)

            setSelectionBox({
                originalWidth: bounds.width,
                topLeftDay: calDay.dayNum,
                width: 1,
                height: 1
            })
        }
    }
  
    return (
        <React.Fragment>
        <div 
        className={`calendar-selection-day`} 
        style={true ? {backgroundColor: 'rgb(240, 189, 240)'} : {backgroundColor: 'transparent'}}
        ref={selectionRef}>
            <div className={`calendar-selection-copy-down`}>+</div>
            <div></div>
        </div>
        <div className="table-content">
            {
                currentDays.map((calDay, index) => {

                    let dayEventList = events.filter((vnt) => vnt.day === calDay.number && vnt.month - 1 === calDay.month && vnt.year === calDay.year)
                    let timeEntryProvided = monthlyTimeEntries.find(({ day, month, year }) => (
                            day === calDay.number && month === calDay.month + 1 && year === calDay.year && currentDay.getMonth() === month - 1))

                    const twoMonthRange = (calDay.month === today.getMonth() || calDay.month === (today.getMonth() === 11 ? 0 : today.getMonth() + 1)) && 
                    today.getFullYear() === calDay.year

                    return (
                    <div 
                    className={`calendar-day ${calDay.currentMonth ? "current" : ""} ${calDay.selected ? " selected" : ""}`}
                    key={index}
                    onClick={() => handleCalendarDayClick(calDay, dayEventList)}
                    style={ timeEntryProvided ? {backgroundColor: 'green'} : null }
                    ref={getRef(index)}
                    >        
                        <p className='no-select-text'>{calDay.number}</p>
                        <div style={{display:'flex', flexDirection: 'column'}}>
                            <button 
                            className='toggle-time-entry-button no-select-text'
                            style={
                                (
                                    auth.user && 
                                    twoMonthRange
                                ) ? 
                                null : 
                                {visibility: 'hidden', pointerEvents: 'none'}
                            } 
                            onClick={
                                (auth.user && calDay.month === today.getMonth()) ? 
                                (e) => {
                                    setToggleTimeEntry(true)
                                    setEntryDate(calDay.date)
                                    e.stopPropagation()
                                } : 
                                (e) => { 
                                    // setAlert({active: true, message: 'Please Log In'}) 
                                    e.stopPropagation()
                                } 
                            }>
                            {`${timeEntryProvided ? `Update` : `Add`}`}
                            </button>
                            <button
                            className={`toggle-time-entry-button no-select-text`}
                            style={
                                (auth.user && (auth.roles ? auth.roles.includes('Admin') : false) && twoMonthRange) ?
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
                        {/* <div 
                        className='calendar-event-blob' 
                        style={dayEventList.length === 0 ? {visibility: 'hidden', pointerEvents: 'none'} : null}>
                            <p className='no-select-text'>{`${dayEventList.length} Event(s)`}</p>
                        </div> */}

                    </div>
                    )
                })
            }
        </div>
        </React.Fragment>
    )
}
