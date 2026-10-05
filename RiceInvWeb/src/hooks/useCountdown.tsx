import { useState, useRef, useCallback, useEffect } from 'react';

interface CountdownInterval {
    initTime : number;
    task : () => void;
    tickRate : number;
}

export default function useCountdown(intervals : CountdownInterval[]) {

    const [subTime, setSubTime] = useState(intervals.length ? intervals[0].initTime : 0);
    const [isRunning, setIsRunning] = useState(false); 

    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const endTimeRef = useRef<number>(0);
    const remainingAtPauseRef = useRef<number>(intervals.length ? intervals[0].initTime : 0);
    const indexRef = useRef<number>(0);

    const clear = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const next = (i : number) => {
        clearInterval(intervalRef.current!);
        endTimeRef.current = Date.now() + intervals[i].initTime;
        intervalRef.current = setInterval(tick, intervals[i].tickRate, intervals[i].task);
    }

    const tick = useCallback((task : () => void) => {
        const remaining = endTimeRef.current - Date.now();
        if (remaining > 0) {
            setSubTime(remaining);
            return;
        }

        const currentIndex = indexRef.current;
        if (intervals.length > currentIndex + 1) {
            indexRef.current = currentIndex + 1;
            next(currentIndex + 1);
        }
        else {
            clear();
            setIsRunning(false);
            setSubTime(0);
        }
        task();

    }, [intervals.length]);

    const start = useCallback(() => {
        clear();
        setIsRunning(true);
        endTimeRef.current = Date.now() + remainingAtPauseRef.current;
        intervalRef.current = setInterval(tick, intervals[indexRef.current].tickRate, intervals[indexRef.current].task);
    }, [tick, indexRef.current]);

    // const pause = useCallback(() => {
    //     clear();
    //     setIsRunning(false);
    //     remainingAtPauseRef.current = Math.max(0, endTimeRef.current - Date.now());
    //     setTime(remainingAtPauseRef.current);
    // }, []);

    const reset = useCallback((newIntervals: CountdownInterval[] = intervals) => {
        clear();
        setIsRunning(false);
        indexRef.current = 0;
        remainingAtPauseRef.current = newIntervals.length ? newIntervals[0].initTime : 0;
        setSubTime(newIntervals.length ? newIntervals[0].initTime : 0);
    }, [intervals]);

    // const cancel = useCallback(() => {
    //     clear();
    //     setIsRunning(false);
    //     setIndex(0);
    //     remainingAtPauseRef.current = 0;
    //     setTime(0);
    // }, []);

    useEffect(() => {
        return () => clear();
    }, []);

    return { subTime, isRunning, start, reset };
}