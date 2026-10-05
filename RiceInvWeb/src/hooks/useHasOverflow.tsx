import { useLayoutEffect, useState } from "react";

export default function useHasOverflow(ref: React.RefObject<HTMLElement | null>) {
    const [overflowing, setOverflowing] = useState(false);

    if (!ref) return;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const check = () => setOverflowing(el.scrollHeight > el.clientHeight);
        check();

        const observer = new ResizeObserver(check);
        observer.observe(el);
        // children changing size changes scrollHeight without resizing the container
        Array.from(el.children).forEach(child => observer.observe(child));

        return () => observer.disconnect();
    }, [ref]);

    return overflowing;
}