import { useContext } from "react";
import RiceEventContext from "../context/RiceEventContextProvider";


export default function useRiceEvent() {
    const context = useContext(RiceEventContext);
    if (!context) {
        throw new Error('Rice Events Not Available');
    }
    return context;
}