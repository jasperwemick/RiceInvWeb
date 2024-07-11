import React, { useState, useEffect } from "react";

const TimeInterval = ({index, intervalData, toggleRange, updateRange}) => {

    const indexToTime = () => {
        const hour = String(Math.floor(index / 2))
        const prefix = hour.length == 1 ? '0' : ''
        const minutes = index % 2 == 0 ? '00' : '30'
        return prefix + hour + ':' + minutes
    }

    return (
        <div>
            <p className="no-select-text">{indexToTime()}</p>
            <div 
                className={`time-interval-block ${intervalData ? `time-interval-selected` : null}`} 
                onMouseEnter={toggleRange ? () => updateRange(index) : null}
                onClick={toggleRange ? () => toggleRange(index) : null}></div>
        </div>
    )
}

export const TimeEntry = ({ timeInvervalData, setTimeIntervalData }) => {

    const [oldData, setOldData] = useState(Array(48).fill(false))

    const [lockedClick, setLockedClick] = useState(false)

    const [startInterval, setStartInterval] = useState(0)

    const [mode, setMode] = useState(true)

    useEffect(() => {

        if (lockedClick) {
            setOldData(timeInvervalData)
        }
        
    },[lockedClick])

    const toggleRange = (index) => {

        let newIntervalArr = [...timeInvervalData]

        if (!lockedClick) {
            if (newIntervalArr[index]) {
                setMode(false)
                newIntervalArr[index] = false
            }
            else {
                setMode(true)
                newIntervalArr[index] = true
            }
        }
        else {
            // Memorize previous saved state of array
            setOldData(newIntervalArr)
        }

        setLockedClick(!lockedClick)
        setStartInterval(index)
        setTimeIntervalData(newIntervalArr)
    }

    const updateRange = (index) => {
        if (lockedClick) {

            let left = startInterval <= index ? startInterval : index
            let right = left === startInterval ? index : startInterval

            setTimeIntervalData(timeInvervalData.map((interval, i) => {
                if (i >= left && i <= right) {
                    return mode
                }
                return oldData[i]
            }))

        }
    }

    return (
        <div>
            <div className={`time-entry-header`}>
                <p className="no-select-text">{`AM`}</p>
                <p className="no-select-text">{`PM`}</p>
            </div>
            <div className={`time-entry-container`} >
                {
                    timeInvervalData.map((interval, index) => {
                        return (
                            <TimeInterval 
                                index={index} 
                                intervalData={interval}
                                toggleRange={setTimeIntervalData ? toggleRange : null}
                                updateRange={setTimeIntervalData ? updateRange : null}
                                key={index}/>
                        )
                    })
                }
            </div>
        </div>
    )
}