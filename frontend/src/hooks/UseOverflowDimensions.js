import { useMemo, useSyncExternalStore } from "react"

function subscribe(callback) {
    window.addEventListener("resize", callback)
    return () => {
        window.removeEventListener("resize", callback)
    }
}

function useOverflowDimensions(ref) {
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