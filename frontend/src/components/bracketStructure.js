import React from "react";

import { BracketSet } from "../components/bracket.js"

const BracketPiece = (props) => {
    return (
        <div>
            <div className="set-slot" style={props.slotStyle}>{props.playoffSet}</div>
            <svg style={props.svgStyle}>
                <path d={props.path}></path>
            </svg>
        </div>
    )
}

export const GauntletBrawl = (props) => {

    const bracketMap = (sets) => {
        return sets.map((set, index) => {
            const leftShift = ((index % 3) * 200);
            const topShift = (Math.floor((index / 3)) * 120);
            return (
                <BracketPiece 
                    key={set._id}
                    slotStyle={{left: 0 + leftShift, top: 50 + topShift}} 
                    svgStyle={index % 3 !== 2 ? {left: 160 + leftShift, top: 70 + topShift} : {}}
                    path={index % 3 !== 2 ? " M 0, 10 L 40, 10 " : ""}
                    playoffSet={<BracketSet set={set} parents={[set.winnerStats.prevSet, set.loserStats.prevSet]}/>} 
                />
            )
        })
    }
    return (
        <div>{bracketMap(props.sets)}</div>
    )
}

export const UpperBrawlOnes = (props) => {

    const bracketMap = (sets) => {
        return sets.map((set, index) => {

            const leftShift = (Math.floor(index / 4) === 0 ? 0 
                                : Math.floor(index / 6) === 0 ? 400 
                                : index === sets.length - 3 ? 800 
                                : index === sets.length - 2 ? 1000 
                                : 1200);
            const topShift = (set.details === 'Q' ? (index % 4) * 120 
                                : set.details === 'S' ? 60 + (index % 2) * 240 
                                : 180);
            const topShiftSvg = (set.details === 'Q' ? ((index % 4) * 120 - (index % 2 === 1 ? 60 : 0)) 
                                : set.details === 'S' ? 60 + (index % 2) * 240 - (index % 2 === 1 ? 120 : 0) 
                                : 180);

            const path= (set.details === 'Q' 
                            ? (index % 2 === 0 
                                ? " M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 65 Q 120, 70 125, 70 L 240, 70 " 
                                : " M 0, 70 L 115, 70 Q 120, 70 120, 65 L 120, 15 Q 120, 10 125, 10 L 240, 10 ") 
                            : set.details === 'S'
                                ? (index % 2 === 0
                                    ? " M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 125 Q 120, 130 125, 130 L 240, 130 " 
                                    : " M 0, 130 L 115, 130 Q 120, 130 120, 125 L 120, 15 Q 120, 10 125, 10 L 240, 10 ") 
                                : index !== sets.length - 1 
                                    ? " M 0, 10 L 40, 10 " 
                                    : "")
            return (
                <BracketPiece 
                    key={set._id}
                    slotStyle={{left: 0 + leftShift, top: 50 + topShift}} 
                    svgStyle={{left: 160 + leftShift, top: 70 + topShiftSvg}}
                    path={path}
                    playoffSet={<BracketSet set={set} parents={[set.winnerStats.prevSet, set.loserStats.prevSet]}/>} 
                />
            )
        })
    }
    return (
    <div>  
        {bracketMap(props.sets)}
    </div>
    )
}

export const LowerBrawlOnes = (props) => {

    const bracketMap = (sets) => {
        return sets.map((set, index) => {

            const leftShift = (Math.floor(index / 4) === 0 ? 0 
                                : Math.floor(index / 8) === 0 ? 200 
                                : Math.floor(index / 10) === 0? 400 
                                : Math.floor(index / 12) === 0? 600 
                                : index === sets.length - 2 ? 800
                                : 1000);
            const topShift = (set.details === 'Q' ? (index % 4) * 120 
                                : set.details === 'S' ? 60 + (index % 2) * 240
                                : 180);
            const topShiftSvg = (set.details === 'Q' 
                                ? ((index % 4) * 120 - (Math.floor(index / 4) === 1 ? (index % 2 === 1 ? 60 : 0) : 0)) 
                                : set.details === 'S' 
                                    ? 60 + (index % 2) * 240 - (Math.floor(index / 10) === 1 ? (index % 2 === 1 ? 120 : 0) : 0)
                                    : 180);

            const path= (set.details === 'Q' 
                            ? (Math.floor(index / 4) === 0 
                                ? " M 0, 10 L 40, 10 " 
                                : index % 2 === 0 
                                    ? " M 0, 10 L 15, 10 Q 20, 10 20, 15, L 20, 65 Q 20, 70 25, 70 L 40, 70 "
                                    : " M 0, 70 L 15, 70 Q 20, 70 20, 65 L 20, 15 Q 20, 10 25, 10 L 40, 10 ") 
                            : set.details === 'S'
                                ? (Math.floor(index / 10) === 0
                                    ? " M 0, 10 L 40, 10 "
                                    : index % 2 === 0
                                        ? " M 0, 10 L 15, 10 Q 20, 10 20, 15 L 20, 125 Q 20, 130 25, 130 L 40, 130 " 
                                        : " M 0, 130 L 15, 130 Q 20, 130 20, 125 L 20, 15 Q 20, 10 25, 10 L 40, 10 ") 
                                : index !== sets.length - 1 
                                    ? " M 0, 10 L 40, 10 " 
                                    : "")
            return (
                <BracketPiece 
                    key={set._id}
                    slotStyle={{left: 0 + leftShift, top: 50 + topShift}} 
                    svgStyle={{left: 160 + leftShift, top: 70 + topShiftSvg}}
                    path={path}
                    playoffSet={<BracketSet set={set} parents={[set.winnerStats.prevSet, set.loserStats.prevSet]}/>} 
                />
            )
        })
    }
    return (
        <div>{bracketMap(props.sets)}</div>
    )
}

export const UpperBrawlTwos = (props) => {
    
    const bracketMap = (sets) => {
        return sets.map((set, index) => {

            const leftShift = (Math.floor(index / 2) === 0 ? 0 
                                : index === sets.length - 3 ? 400 
                                : index === sets.length - 2 ? 600 
                                : 800);
            const topShift = (set.details === 'Q' ? (index % 4) * 120 
                                : set.details === 'S' ? 60 + (index % 2) * 240 
                                : 180);
            const topShiftSvg = (set.details === 'Q' ? ((index % 4) * 120 - (index % 2 === 1 ? 60 : 0)) 
                                : set.details === 'S' ? 60 + (index % 2) * 240 - (index % 2 === 1 ? 120 : 0) 
                                : 180);

            const path= (set.details === 'Q' 
                            ? (index % 2 === 0 
                                ? " M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 65 Q 120, 70 125, 70 L 240, 70 " 
                                : " M 0, 70 L 115, 70 Q 120, 70 120, 65 L 120, 15 Q 120, 10 125, 10 L 240, 10 ") 
                            : set.details === 'S'
                                ? (index % 2 === 0
                                    ? " M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 125 Q 120, 130 125, 130 L 240, 130 " 
                                    : " M 0, 130 L 115, 130 Q 120, 130 120, 125 L 120, 15 Q 120, 10 125, 10 L 240, 10 ") 
                                : index !== sets.length - 1 
                                    ? " M 0, 10 L 40, 10 " 
                                    : "")
            return (
                <BracketPiece 
                    key={set._id}
                    slotStyle={{left: 0 + leftShift, top: 50 + topShift}} 
                    svgStyle={{left: 160 + leftShift, top: 70 + topShiftSvg}}
                    path={path}
                    playoffSet={<BracketSet set={set} parents={[set.winnerStats.prevSet, set.loserStats.prevSet]}/>} 
                />
            )
        })
    }
    return (
        <div>{bracketMap(props.sets)}</div>
    )
}

export const LowerBrawlTwos = (props) => {

    const bracketMap = (sets) => {
        return sets.map((set, index) => {

            const leftShift = (Math.floor(index / 2) === 0 ? 0 
                                : Math.floor(index / 4) === 0 ? 200 
                                : index === sets.length - 2 ? 400
                                : 600);
            const topShift = (set.details === 'Q' ? (index % 4) * 120 
                                : set.details === 'S' ? 60 + (index % 2) * 240
                                : 180);
            const topShiftSvg = (set.details === 'Q' 
                                ? ((index % 4) * 120 - (Math.floor(index / 4) === 1 ? (index % 2 === 1 ? 60 : 0) : 0)) 
                                : set.details === 'S' 
                                    ? 60 + (index % 2) * 240 - (Math.floor(index / 2) === 1 ? (index % 2 === 1 ? 120 : 0) : 0)
                                    : 180);

            const path= (set.details === 'Q' 
                            ? (Math.floor(index / 4) === 0 
                                ? " M 0, 10 L 40, 10 " 
                                : index % 2 === 0 
                                    ? " M 0, 10 L 15, 10 Q 20, 10 20, 15, L 20, 65 Q 20, 70 25, 70 L 40, 70 "
                                    : " M 0, 70 L 15, 70 Q 20, 70 20, 65 L 20, 15 Q 20, 10 25, 10 L 40, 10 ") 
                            : set.details === 'S'
                                ? (Math.floor(index / 2) === 0
                                    ? " M 0, 10 L 40, 10 "
                                    : index % 2 === 0
                                        ? " M 0, 10 L 15, 10 Q 20, 10 20, 15 L 20, 125 Q 20, 130 25, 130 L 40, 130 " 
                                        : " M 0, 130 L 15, 130 Q 20, 130 20, 125 L 20, 15 Q 20, 10 25, 10 L 40, 10 ") 
                                : index !== sets.length - 1 
                                    ? " M 0, 10 L 40, 10 " 
                                    : "")
            return (
                <BracketPiece 
                    key={set._id}
                    slotStyle={{left: 0 + leftShift, top: 50 + topShift}} 
                    svgStyle={{left: 160 + leftShift, top: 70 + topShiftSvg}}
                    path={path}
                    playoffSet={<BracketSet set={set} parents={[set.winnerStats.prevSet, set.loserStats.prevSet]}/>} 
                />
            )
        })
    }
    return (
        <div>{bracketMap(props.sets)}</div>
    )
}