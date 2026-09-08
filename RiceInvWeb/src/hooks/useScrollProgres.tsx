import { useEffect, useState } from 'react';

export default function useScrollProgress(wrapperRef: React.RefObject<HTMLDivElement | null>) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let rafId: number;

        const measure = () => {
            const el = wrapperRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const scrolled = -rect.top;
            const raw = total > 0 ? scrolled / total : 0;

            setProgress(Math.min(1, Math.max(0, raw)));
        };

        const handleScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(measure);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        measure(); // run once immediately, in case the page loads mid-scroll (e.g. refresh)

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, [wrapperRef]);

    return progress;
}