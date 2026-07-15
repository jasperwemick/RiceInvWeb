import { useContext } from 'react'
import { AlertContextType, AlertContext } from "../context/AlertProvider"

export default function useAlert() : AlertContextType {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('Alert Context Missing');
    }
    return context;
}
