import React, { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert"
import '../style/alert.css'

export default function Alert() {

    const { alert, setAlert } = useAlert()

    const timerId = useRef(0);
    const alertDuration = 3000

    useEffect(() => {

        if (alert) {

            timerId.current = setTimeout(() => {

                setAlert({
                    active: false,
                    message: ''
                })
    
            }, alertDuration)

            return () => {
                clearTimeout(timerId.current)
            }
        }

    }, [alert])

    return (
        <div className="alert-popup-window" style={alert.active ? {} : {visibility: 'hidden', pointerEvents: 'none'}}>
            <p>{alert.message}</p>
        </div>
    )
}