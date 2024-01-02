import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { calendarMonths } from "../components/calendarMonths";
import dayjs from "dayjs"
import "../style/schedule.css"

const getMonth = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]


const EventItem = (props) => {

    const [isActive, setIsActive] = useState(false)

    const profileList = () => {
        return props.event.profiles.map((profile) => {
            return(
                <div className="event-person">
                    <img src={profile.imageUrl} width={'100px'} height={'125px'}></img>
                    <div><span>{profile.name}</span></div>
                </div>
            )
        })
    }

    return (
        <li className="event-item" key={props.listKey} onClick={() => setIsActive(!isActive)}>
            <div>{props.event.game} - {props.event.title}</div>
            <div>{props.event.time} EST</div>
            <div className={`${isActive ? '' : 'hidden'} event-pop`}>
                <div><span style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>{props.event.title}</span></div>

                <div><span>Game: {props.event.game}</span></div>

                <div><span>{props.event.description}</span></div>

                <div><span>{props.event.time} EST</span></div>
                <div className="event-people-list">{profileList()}</div>
            </div>
        </li>
    )
}


const Week = (props) => {
    return (
        <tr>
            {props.days.map((item) => {
                if (item.day > 0) {
                    return (
                        <td className={`calendar-day ${(item.day === props.today && props.todayInMonth) ? `today-date` : null}`} key={item.day}>
                            <div className="calendar-number"><span>{item.day}</span></div>
                            <ul className="event-list">
                                {props.events.map((event, index) => {
                                    if (event.day === item.day) {
                                        return (
                                            <EventItem
                                                key={event._id}
                                                event={event}
                                                listKey={index}
                                            />
                                        )
                                    }
                                })}
                            </ul>
                        </td>
                    )
                }
                else {
                    return (
                        <td key={item.day}></td>
                    )
                }

            })}
        </tr>
    )
}

export default function SchedulePage() {

    const month = dayjs().month();
    const year = dayjs().year();
    const day = dayjs().date();

    const [weekObjs, setWeekObjs] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);
    const [yearMonth, setYearMonth] = useState("");
    const [today, setToday] = useState(0);
    const [events, setEvents] = useState([]);
    const [hasNextMonth, setHasNextMonth] = useState(true);
    const [hasPrevMonth, setHasPrevMonth] = useState(true);

    useEffect(() => {

        const monthObj = calendarMonths.find(x => x.month === selectedMonth && x.year === selectedYear)

        async function getEvents(m, y) {
            try {
                const response = await fetch(`http://127.0.0.1:4000/api/events/current?month=${m}&year=${y}`);
                const events = await response.json();

                const responseProfiles = await fetch(`http://127.0.0.1:4000/api/profiles`);
                const profiles = await responseProfiles.json();
                events.forEach((item, index) => {
                    const eventProfiles = profiles.filter(x => item.people.includes(x._id));
                    events[index].profiles = eventProfiles;
                });

                setEvents(events);
            }
            catch(e) {
                const message = `An error occurred: ${e}`;
                window.alert(message);
                return;
            }
        }
        getEvents(selectedMonth, selectedYear);
        setYearMonth(getMonth[month] + ' ' + day + ', ' + String(year))
        setWeekObjs(monthObj.weeks)
        setHasNextMonth(!monthObj.end)
        setHasPrevMonth(!monthObj.start)
        setToday(day)
        return;

    }, [events.length, selectedMonth])

    const mapDays = () => {
        return weekObjs.map((w) => {
            return (
                <Week
                    days={w.days}
                    todayInMonth={month === selectedMonth}
                    week={w.week}
                    today={today}
                    events={events}
                    key={w.week}
                />
            )
        })
    }

    const nextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        }
        else {
            selectedMonth(selectedMonth + 1);
        }
    }

    const prevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        }
        else {
            selectedMonth(selectedMonth - 1);
        }
    }

    return (
        <div className="calendar">
            <div>
                <div><span style={{fontSize: 20}}>{getMonth[selectedMonth] + ' ' + String(selectedYear)}</span></div>
                <button className={`${hasPrevMonth ? '': 'hidden'} switch-button`} onClick={prevMonth}></button>
                <button className={`${hasNextMonth ? '': 'hidden'} switch-button`} onClick={nextMonth}></button>
                <div><span style={{fontSize: 20}}>{`Today: ${yearMonth}`}</span></div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                    </tr>
                </thead>
                <tbody>
                    {mapDays()}
                </tbody>
            </table>
        </div>
    )
}