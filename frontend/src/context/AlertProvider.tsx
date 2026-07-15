import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'

interface AlertType {
    active : boolean;
    message : string;
}

export interface AlertContextType {
    alert : AlertType;
    setAlert : Dispatch<SetStateAction<AlertType>>;
}

export const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children } : { children : ReactNode }) => {
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