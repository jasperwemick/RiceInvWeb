import { createRef, useCallback, useRef, type RefObject } from "react"

export default function useGetRef<T>() {
    const refs = useRef<Record<number, RefObject<T>>>({})
    return useCallback(
        (idx : number) => (refs.current[idx] ??= createRef()),
        [refs]
    )
}