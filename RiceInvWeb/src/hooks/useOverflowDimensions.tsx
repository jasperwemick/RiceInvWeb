import { type RefObject, useMemo, useSyncExternalStore } from "react"

function subscribe(callback : () => void) {
    window.addEventListener("resize", callback)
    return () => {
        window.removeEventListener("resize", callback)
    }
}

function useOverflowDimensions(ref : RefObject<HTMLUListElement>) {
    const dimensions = useSyncExternalStore(
        subscribe,
        () => JSON.stringify({
            scrollWidth: ref.current?.scrollWidth ?? 0, // 0 is default width
            scrollHeight: ref.current?.scrollHeight ?? 0, // 0 is default height
        })
    )
    return useMemo(() => JSON.parse(dimensions), [dimensions])
}

export { useOverflowDimensions }