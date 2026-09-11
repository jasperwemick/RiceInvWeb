import { useContext } from 'react'
import AuthContext from "../context/AuthProvider"

export default function useValidContext<T>( context : React.Context<T> ) {
    const c = useContext(context);
    if (!c) {
        throw new Error('Auth context not available')
    }
    return c;
}