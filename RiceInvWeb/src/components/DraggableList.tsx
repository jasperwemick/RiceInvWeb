import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction, ReactNode } from 'react';
import './Profile/style/profile.css'
import { useOverflowDimensions } from "../hooks/useOverflowDimensions";

interface DraggableListProps {
    setScrollLength : Dispatch<SetStateAction<number>>;
    setListLength : Dispatch<SetStateAction<number>>;
    profileTicks : number;
    children : ReactNode;
}

export default function DraggableList({setScrollLength, setListLength, profileTicks, children} : DraggableListProps) {
    const sliderRef = useRef<HTMLUListElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const { scrollWidth } = useOverflowDimensions(sliderRef)

    const [resetLoop, setResetLoop] = useState(false)

    // Maybe move infinite looping list shit from ProfileList into here

    const mouseCoords = useRef({
        startX: 0,
        scrollLeft: 0
    });

    useEffect(() => {
        setListLength(scrollWidth)
    }, [scrollWidth])

    useEffect(() => {
        const current = sliderRef.current
        if (current) {
            current.scrollLeft = scrollWidth * 0.25
            if (isMouseDown) {
                setResetLoop(true)
            }
        }
    }, [profileTicks])

    // Do some shit to make the list consistently shift one direction

    // useEffect(() => {
    //     const id = setInterval(() => {

    //     }, 1000)

    //     return () => clearInterval(id)
    // })

    const handleDragStart = (e : React.MouseEvent<HTMLUListElement>) => {
        if (!sliderRef.current) return
        const slider = sliderRef.current;
        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;
        mouseCoords.current = { startX, scrollLeft }
        setIsMouseDown(true)
        document.body.style.cursor = "grabbing"
    }
    const handleDragEnd = (e : React.MouseEvent<HTMLUListElement>) => {
        e.stopPropagation()
        setIsMouseDown(false)
        if (!sliderRef.current) return
        document.body.style.cursor = "default"
    }
    const handleDrag = (e : React.MouseEvent<HTMLUListElement>) => {
        if (!isMouseDown || !sliderRef.current) return;
        e.preventDefault();

        const slider = sliderRef.current;
        const x = e.pageX - slider.offsetLeft;
        if (resetLoop) {
            mouseCoords.current = { startX: x, scrollLeft: slider.scrollLeft}
            setResetLoop(false)
        }
        const walkX = (x - mouseCoords.current.startX);
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;


    }

    const updateScroll = () => {
        if (!sliderRef.current) return
        setScrollLength(sliderRef.current.scrollLeft)
    }
  
    return (
        <ul 
        ref={sliderRef} 
        onMouseDown={handleDragStart} 
        onMouseUp={handleDragEnd} 
        onMouseMove={handleDrag} 
        onMouseLeave={handleDragEnd} 
        onScroll={updateScroll} 
        className="profile-list">
            {children}
        </ul>
    );
};