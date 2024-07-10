import { createContext, useState } from 'react'

const AlertContext = createContext({
    active: false,
    message: ''
})

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        active: false,
        message: ''
    });
    return (
        <AlertContext.Provider value={ { alert, setAlert } }>
            { children }
        </AlertContext.Provider>
    )
}

export default AlertContext;