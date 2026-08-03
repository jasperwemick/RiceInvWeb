import { useState, useEffect, useRef, useLayoutEffect } from "react";
import type { ReactNode } from 'react';
import './Profile/style/profile.css'
import { useOverflowDimensions } from "../hooks/useOverflowDimensions";
import type { Profile } from "../data/types";

interface DraggableListProps {
    items : Profile[];
    children : ReactNode;
    infinite? : boolean;
    animate? : boolean;
}

export default function DraggableList({items, infinite=true, animate=false, children} : DraggableListProps) {
    const sliderRef = useRef<HTMLUListElement>(null);
    const animationFrameId = useRef<number>(0);

    const [isMouseDown, setIsMouseDown] = useState(false);
    const { scrollWidth } = useOverflowDimensions(sliderRef)
    const [resetLoop, setResetLoop] = useState<'None' | 'Left' | 'Right'>('None');

    const [scrollLength, setScrollLength] = useState(0)
    const [listLength, setListLength] = useState(0)
    const [profileTicks, setProfileTicks] = useState(0)


    const mouseCoords = useRef({
        startX: 0,
        scrollLeft: 0
    });

    // Initially offsets the list to be at the center of it's width
    useLayoutEffect(() => {
        const current = sliderRef.current;
        if (current && scrollWidth > 0) {
            current.scrollLeft = scrollWidth * 0.5;
            setScrollLength(current.scrollLeft);
        }
    }, [items.length, scrollWidth]);

    // Sets the list length
    useEffect(() => {
        setListLength(scrollWidth);
    }, [scrollWidth]);

    // Watches for a "tick". A tick occurs when the scrollLength reaches a threshold of percentage of the list length, about 1/4 or 3/4 of the length.
    // When this occurs, it signals for a seamless adjustment in the scroll so that it gives the illusion of an infinite list
    useEffect(() => {
        if (items.length > 0 && infinite) {
            
            const itemWidth = (0.5 * listLength) / items.length;
            const tick = Math.floor((scrollLength - (0.25 * listLength)) / (itemWidth * items.length));
            if (tick !== profileTicks) {
                setProfileTicks(tick);
            }
        }

    }, [scrollLength, infinite])

    // Once a tick occurs, scroll is shifted up/down half the length of the list
    useEffect(() => {
        const current = sliderRef.current;
        if (current) {
            current.scrollLeft = profileTicks == 1 ? (scrollWidth * 0.25 + 4) : profileTicks == -1 ? (scrollWidth * 0.75 - 4)  : current.scrollLeft;
            if (isMouseDown) {
                setResetLoop(profileTicks == -1 ? 'Left' : profileTicks == 1 ? 'Right' : 'None');
            }
        }
    }, [profileTicks]);

    // Animates the list to constantly scroll at a speed of 1 pixel/frame
    useEffect(() => {
        const speed = 1;

        const step = () => {
            if (sliderRef.current) {
                sliderRef.current.scrollLeft += speed;
            }
            animationFrameId.current = requestAnimationFrame(step);
        };

        if (animate) {
            animationFrameId.current = requestAnimationFrame(step);
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [animate]);

    const handleDragStart = (e : React.MouseEvent<HTMLUListElement>) => {
        if (!sliderRef.current) return;
        const slider = sliderRef.current;
        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;
        mouseCoords.current = { startX, scrollLeft };
        setIsMouseDown(true);
        document.body.style.cursor = "grabbing";
    }

    const handleDragEnd = (e : React.MouseEvent<HTMLUListElement>) => {
        e.stopPropagation();
        setIsMouseDown(false);
        if (!sliderRef.current) return;
        document.body.style.cursor = "default";
    }

    const handleDrag = (e : React.MouseEvent<HTMLUListElement>) => {
        if (!isMouseDown || !sliderRef.current) return;
        e.preventDefault();

        const slider = sliderRef.current;
        const x = e.pageX - slider.offsetLeft;
        if (resetLoop === 'Right') {
            mouseCoords.current = { startX: x, scrollLeft: slider.scrollLeft};
            setResetLoop('None');
        }
        else if (resetLoop === 'Left') {
            mouseCoords.current = { startX: x, scrollLeft: slider.scrollLeft};
            setResetLoop('None');
        }
        const walkX = (x - mouseCoords.current.startX);
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    }

    const handleWheel = (e : React.WheelEvent<HTMLUListElement>) => {

    }

    const updateScroll = () => {
        if (!sliderRef.current) return;
        setScrollLength(sliderRef.current.scrollLeft);
    }
  
    return (
        <ul 
        ref={sliderRef} 
        onMouseDown={handleDragStart} 
        onMouseUp={handleDragEnd} 
        onMouseMove={handleDrag} 
        onMouseLeave={handleDragEnd}
        onWheel={handleWheel}
        onScroll={updateScroll} 
        className="profile-list">
            {children}
        </ul>
    );
};