import React, { useState, useEffect, useRef } from "react";
import './Profile/style/profile.css'
import { useOverflowDimensions } from "../hooks/UseOverflowDimensions";

export const DraggableList = ({setScrollLength, setListLength, profileTicks, children}) => {
    const ourRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const { scrollWidth } = useOverflowDimensions(ourRef)

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
        ourRef.current.scrollLeft = scrollWidth * 0.25
        if (isMouseDown) {
            setResetLoop(true)
        }
    }, [profileTicks])

    // Do some shit to make the list consistently shift one direction

    // useEffect(() => {
    //     const id = setInterval(() => {

    //     }, 1000)

    //     return () => clearInterval(id)
    // })

    const handleDragStart = (e) => {
        if (!ourRef.current) return
        const slider = ourRef.current;
        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;
        mouseCoords.current = { startX, scrollLeft }
        setIsMouseDown(true)
        document.body.style.cursor = "grabbing"
    }
    const handleDragEnd = (e) => {
        e.stopPropagation()
        setIsMouseDown(false)
        if (!ourRef.current) return
        document.body.style.cursor = "default"
    }
    const handleDrag = (e) => {
        if (!isMouseDown || !ourRef.current) return;
        e.preventDefault();

        const slider = ourRef.current;
        const x = e.pageX - slider.offsetLeft;
        if (resetLoop) {
            mouseCoords.current = { startX: x, scrollLeft: slider.scrollLeft}
            setResetLoop(false)
        }
        const walkX = (x - mouseCoords.current.startX);
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;


    }

    const updateScroll = () => {
        if (!ourRef.current) return
        setScrollLength(ourRef.current.scrollLeft)
        console.log(mouseCoords.current)
    }
  
    return (
        <ul 
        ref={ourRef} 
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