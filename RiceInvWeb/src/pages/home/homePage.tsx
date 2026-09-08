import { NavigationProfile } from "../../components/Profile/NavigationProfile";
import './style/home.css'
import ProfileList from "../../components/Profile/ProfileList";
import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type MouseEventHandler } from "react";
import useProfiles from "../../components/Profile/hooks/useProfiles";
import useScrollProgress from "../../hooks/useScrollProgres";
import MeInfo from "./components/MeInfo";

interface ScrollFrameSequenceProps {
    frames: ComponentType<{ style : CSSProperties }>[];
    scrollHeightVh?: number; // how many viewport-heights tall the scrollable wrapper is — more = slower/longer scrub
}

function ScrollFrameSequence({ frames, scrollHeightVh = 400 }: ScrollFrameSequenceProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const progress = useScrollProgress(wrapperRef);

    const frameCount = frames.length;
    const rawIndex = progress * (frameCount - 1);
    const currentIndex = Math.min(frameCount - 2, Math.floor(rawIndex)); // clamp so currentIndex+1 stays valid
    const localProgress = rawIndex - currentIndex;

    return (
        <div ref={wrapperRef} style={{ height: `${scrollHeightVh}vh`, position: 'relative' }}>
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
                    let opacity = 0;

                    if (i === currentIndex) opacity = 1 - localProgress;
                    else if (i === currentIndex + 1) opacity = localProgress;
                    else if (i < currentIndex) opacity = 0;
                    else if (i > currentIndex + 1) opacity = 0;

                    // keep the very first/last frame fully visible at the absolute ends of scroll
                    if (i === 0 && progress === 0) opacity = 1;
                    if (i === frameCount - 1 && progress === 1) opacity = 1;

                    return (
                        <Component
                            key={i}
                            style={{
                                position: 'absolute',
                                maxWidth: '80%',
                                maxHeight: '80%',
                                opacity,
                                willChange: 'opacity', // hints the browser to optimize for frequent opacity changes
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default function Home() { 
    return (
        <div>
            <section>
                <div className={`home-title-container`}>
                    <div className={`home-title-text`}>
                        <p>The Rice Invitational</p>
                    </div>
                    <div style={{display: "flex", justifyContent: 'center', width: '100%', height: 'fit-content'}}>
                        <ProfileList 
                        Wrapper={NavigationProfile}
                        WrapperProps={{currentLocation: '/', styleOptions: {background: 'linear-gradient(#afc0df, #a1a7e4)'}}}
                        isInfinite={true}/>
                    </div>
                </div>
            </section>
            <section style={{ background : 'linear-gradient(#9198e5, #6998e9ff)', height : '20vh'}}></section>
            <section>
            <ScrollFrameSequence frames={[
                MeInfo
            ]}/>
            </section>
        </div>
    );
}