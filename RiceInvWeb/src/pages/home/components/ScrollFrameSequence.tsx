import { useRef, type ComponentType, type CSSProperties } from "react";
import useScrollProgress from "../../../hooks/useScrollProgres";

interface ScrollFrameSequenceProps {
    frames: ComponentType<{stage : number, progress : number, localProgress : number}>[];
    scrollHeightVh?: number; // how many viewport-heights tall the scrollable wrapper is — more = slower/longer scrub
}

export default function ScrollFrameSequence({ frames, scrollHeightVh = 200 }: ScrollFrameSequenceProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const progress = useScrollProgress(wrapperRef);

    const frameCount = frames.length;
    const rawIndex = progress * (frameCount - 1);
    const currentIndex = Math.floor(rawIndex); // clamp so currentIndex+1 stays valid

    return (
        <div ref={wrapperRef} style={{ height: `${scrollHeightVh}vh`, position: 'relative', background: 'linear-gradient(#6998e9ff, #4071c5)' }}>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {frames.map((Component, i) => {

                    const localProgress = rawIndex - i;

                    return (
                        <Component key={i} stage={i} progress={rawIndex} localProgress={localProgress}/>
                    );
                })}
            </div>
        </div>
    );
}