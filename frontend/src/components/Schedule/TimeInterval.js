import React, { useState, useEffect } from "react";

export const TimeInterval = ({index, intervalData, toggleRange, updateRange}) => {

    const indexToTime = () => {
        let hour = String(Math.floor(index / 2) % 12)
        hour = hour.length === 1 ? '0' + hour : '' + hour 
        hour = hour === '00' ? '12' : hour
        const minutes = index % 2 == 0 ? '00' : '30'
        const mmm = Math.floor(index / 2) < 12 ? 'AM' : 'PM'
        return hour + ':' + minutes + ' ' + mmm
    }

    return (
        <div>
            <p className="no-select-text" style={{fontSize: 9, marginTop: -4}}>{indexToTime()}</p>
            <div
                className={`time-interval-block ${intervalData ? `time-interval-selected` : null}`} 
                onMouseEnter={toggleRange ? () => updateRange(index) : null}
                onClick={toggleRange ? () => toggleRange(index) : null}></div>
        </div>
    )
}