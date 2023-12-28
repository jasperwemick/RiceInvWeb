import React from "react";

import { GauntletSet, PlayoffSet } from "../components/bracket.js"

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

export const BracketBrawlOnes = (props) => {
    if (props.sets.length == 0) {
        return (
            <div/>
        )
    }
    return (
        <div>
            {/* Gauntlet A */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '50px'}} 
                svgStyle={{left: '160px', top: '70px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[0]}/>} />
            <BracketPiece 
                slotStyle={{left: '200px', top: '50px'}} 
                svgStyle={{left: '360px', top: '70px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[1]}/>}/>
            <BracketPiece 
                slotStyle={{left: '400px', top: '50px'}} 
                playoffSet={<PlayoffSet set={props.sets[2]}/>}/>

            {/* Gauntlet B */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '170px'}} 
                svgStyle={{left: '160px', top: '190px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[3]}/>} />
            <BracketPiece 
                slotStyle={{left: '200px', top: '170px'}} 
                svgStyle={{left: '360px', top: '190px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[4]}/>}/>
            <BracketPiece 
                slotStyle={{left: '400px', top: '170px'}} 
                playoffSet={<PlayoffSet set={props.sets[5]}/>}/>

            {/* Gauntlet C */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '290px'}} 
                svgStyle={{left: '160px', top: '310px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[6]}/>} />
            <BracketPiece 
                slotStyle={{left: '200px', top: '290px'}} 
                svgStyle={{left: '360px', top: '310px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[7]}/>}/>
            <BracketPiece 
                slotStyle={{left: '400px', top: '290px'}} 
                playoffSet={<PlayoffSet set={props.sets[8]}/>}/>

            {/* Gauntlet D */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '410px'}} 
                svgStyle={{left: '160px', top: '430px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[9]}/>} />
            <BracketPiece 
                slotStyle={{left: '200px', top: '410px'}} 
                svgStyle={{left: '360px', top: '430px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[10]}/>}/>
            <BracketPiece 
                slotStyle={{left: '400px', top: '410px'}} 
                playoffSet={<PlayoffSet set={props.sets[11]}/>}/>
        </div>
    )
}

export const BracketBrawlTwos = (props) => {
    if (props.sets.length == 0) {
        return (
            <div/>
        )
    }
    return (
        <div>
            {/* Gauntlet A */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '50px'}} 
                svgStyle={{left: '160px', top: '70px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[0]}/>} />
            <BracketPiece 
                slotStyle={{left: '200px', top: '50px'}} 
                svgStyle={{left: '360px', top: '70px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[1]}/>}/>
            <BracketPiece 
                slotStyle={{left: '400px', top: '50px'}} 
                playoffSet={<PlayoffSet set={props.sets[2]}/>}/>

            {/* Gauntlet B */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '170px'}} 
                svgStyle={{left: '160px', top: '190px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[3]}/>} />
            <BracketPiece 
                slotStyle={{left: '200px', top: '170px'}} 
                svgStyle={{left: '360px', top: '190px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[4]}/>}/>
            <BracketPiece 
                slotStyle={{left: '400px', top: '170px'}} 
                playoffSet={<PlayoffSet set={props.sets[5]}/>}/>
        </div>
    )
}

export const UpperBrawlOnes = (props) => {
    if (props.sets.length == 0) {
        return (
            <div/>
        )
    }
    return (
    <div>  
        {/* Upper Quarters 1 */}
        <BracketPiece 
            slotStyle={{left: '0px', top: '50px'}} 
            svgStyle={{left: '160px', top: '70px'}}
            path={" M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 65 Q 120, 70 125, 70 L 240, 70 "}
            playoffSet={<PlayoffSet set={props.sets[0]}/>} />
        {/* Upper Quarters 2 */}
        <BracketPiece 
            slotStyle={{left: '0px', top: '170px'}} 
            svgStyle={{left: '160px', top: '130px'}}
            path={" M 0, 70 L 115, 70 Q 120, 70 120, 65 L 120, 15 Q 120, 10 125, 10 L 240, 10 "}
            playoffSet={<PlayoffSet set={props.sets[1]}/>}/>
        {/* Upper Quarters 3 */}
        <BracketPiece 
            slotStyle={{left: '0px', top: '290px'}} 
            svgStyle={{left: '160px', top: '310px'}}
            path={" M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 65 Q 120, 70 125, 70 L 240, 70 "}
            playoffSet={<PlayoffSet set={props.sets[2]}/>}/>
        {/* Upper Quarters 4 */}
        <BracketPiece 
            slotStyle={{left: '0px', top: '410px'}} 
            svgStyle={{left: '160px', top: '370px'}}
            path={" M 0, 70 L 115, 70 Q 120, 70 120, 65 L 120, 15 Q 120, 10 125, 10 L 240, 10 "}
            playoffSet={<PlayoffSet set={props.sets[3]}/>}/>
        {/* Upper Semis 1 */}
        <BracketPiece 
            slotStyle={{left: '400px', top: '110px'}} 
            svgStyle={{left: '560px', top: '130px'}}
            path={" M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 125 Q 120, 130 125, 130 L 240, 130 "}
            playoffSet={<PlayoffSet set={props.sets[4]}/>}/>
        {/* Upper Semis 2 */}
        <BracketPiece 
            slotStyle={{left: '400px', top: '350px'}} 
            svgStyle={{left: '560px', top: '250px'}}
            path={" M 0, 130 L 115, 130 Q 120, 130 120, 125 L 120, 15 Q 120, 10 125, 10 L 240, 10 "}
            playoffSet={<PlayoffSet set={props.sets[5]}/>}/>
        {/* Upper Finals */}
        <BracketPiece 
            slotStyle={{left: '800px', top: '230px'}} 
            svgStyle={{left: '960px', top: '250px'}}
            path={" M 0, 10 L 40, 10 "}
            playoffSet={<PlayoffSet set={props.sets[6]}/>}/>
        {/* Grand Finals */}
        <BracketPiece 
            slotStyle={{left: '1000px', top: '230px'}} 
            svgStyle={{left: '1160px', top: '250px'}}
            path={" M 0, 10 L 40, 10 "}
            playoffSet={<PlayoffSet set={props.sets[7]}/>}/>
        {/* Grand Finals Reset*/}
        <BracketPiece 
            slotStyle={{left: '1200px', top: '230px'}}
            playoffSet={<PlayoffSet set={props.sets[8]}/>}/>
    </div>
    )
}

export const LowerBrawlOnes = (props) => {
    if (props.sets.length == 0) {
        return (
            <div/>
        )
    }
    return (
        <div>
            {/* Lower Quarters R1 1 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '50px'}} 
                svgStyle={{left: '160px', top: '70px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[0]}/>}/>
            {/* Lower Quarters R1 2 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '170px'}} 
                svgStyle={{left: '160px', top: '190px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[1]}/>}/>
            {/* Lower Quarters R1 3 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '290px'}} 
                svgStyle={{left: '160px', top: '310px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[2]}/>}/>
            {/* Lower Quarters R1 4 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '410px'}} 
                svgStyle={{left: '160px', top: '430px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[3]}/>}/>
            {/* Lower Quarters R2 1 */}
            <BracketPiece 
                slotStyle={{left: '200px', top: '50px'}} 
                svgStyle={{left: '360px', top: '70px'}}
                path={" M 0, 10 L 15, 10 Q 20, 10 20, 15, L 20, 65 Q 20, 70 25, 70 L 40, 70 "}
                playoffSet={<PlayoffSet set={props.sets[4]}/>}/>
            {/* Lower Quarters R2 2 */}
            <BracketPiece 
                slotStyle={{left: '200px', top: '170px'}} 
                svgStyle={{left: '360px', top: '130px'}}
                path={" M 0, 70 L 15, 70 Q 20, 70 20, 65 L 20, 15 Q 20, 10 25, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[5]}/>}/>
            {/* Lower Quarters R2 3 */}
            <BracketPiece 
                slotStyle={{left: '200px', top: '290px'}} 
                svgStyle={{left: '360px', top: '310px'}}
                path={" M 0, 10 L 15, 10 Q 20, 10 20, 15, L 20, 65 Q 20, 70 25, 70 L 40, 70 "}
                playoffSet={<PlayoffSet set={props.sets[6]}/>}/>
            {/* Lower Quarters R2 4 */}
            <BracketPiece 
                slotStyle={{left: '200px', top: '410px'}} 
                svgStyle={{left: '360px', top: '370px'}}
                path={" M 0, 70 L 15, 70 Q 20, 70 20, 65 L 20, 15 Q 20, 10 25, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[7]}/>}/>
            {/* Lower Semis R1 1 */}
            <BracketPiece 
                slotStyle={{left: '400px', top: '110px'}} 
                svgStyle={{left: '560px', top: '130px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[8]}/>}/>
            {/* Lower Semis R1 2 */}
            <BracketPiece 
                slotStyle={{left: '400px', top: '350px'}} 
                svgStyle={{left: '560px', top: '370px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[9]}/>}/>
            {/* Lower Semis R2 1 */}
            <BracketPiece 
                slotStyle={{left: '600px', top: '110px'}} 
                svgStyle={{left: '760px', top: '130px'}}
                path={" M 0, 10 L 15, 10 Q 20, 10 20, 15 L 20, 125 Q 20, 130 25, 130 L 40, 130 "}
                playoffSet={<PlayoffSet set={props.sets[10]}/>}/>
            {/* Lower Semis R2 2 */}
            <BracketPiece 
                slotStyle={{left: '600px', top: '350px'}} 
                svgStyle={{left: '760px', top: '250px'}}
                path={" M 0, 130 L 15, 130 Q 20, 130 20, 125 L 20, 15 Q 20, 10 25, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[11]}/>}/>
            {/* Lower Finals */}
            <BracketPiece 
                slotStyle={{left: '800px', top: '230px'}} 
                svgStyle={{left: '960px', top: '250px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[12]}/>}/>
            {/* Lower Decider */}
            <BracketPiece 
                slotStyle={{left: '1000px', top: '230px'}}
                playoffSet={<PlayoffSet set={props.sets[13]}/>}/>
        </div>
    )
}

export const UpperBrawlTwos = (props) => {
    if (props.sets.length == 0) {
        return (
            <div/>
        )
    }
    return (
        <div>
            {/* Upper Semis 1 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '110px'}} 
                svgStyle={{left: '160px', top: '130px'}}
                path={" M 0, 10 L 115, 10 Q 120, 10 120, 15 L 120, 125 Q 120, 130 125, 130 L 240, 130 "}
                playoffSet={<PlayoffSet set={props.sets[0]}/>}/>
            {/* Upper Semis 2 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '350px'}} 
                svgStyle={{left: '160px', top: '250px'}}
                path={" M 0, 130 L 115, 130 Q 120, 130 120, 125 L 120, 15 Q 120, 10 125, 10 L 240, 10 "}
                playoffSet={<PlayoffSet set={props.sets[1]}/>}/>
            {/* Upper Finals */}
            <BracketPiece 
                slotStyle={{left: '400px', top: '230px'}} 
                svgStyle={{left: '560px', top: '250px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[2]}/>}/>
            {/* Grand Finals */}
            <BracketPiece 
                slotStyle={{left: '600px', top: '230px'}} 
                svgStyle={{left: '760px', top: '250px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[3]}/>}/>
            {/* Grand Finals Reset*/}
            <BracketPiece 
                slotStyle={{left: '800px', top: '230px'}}
                playoffSet={<PlayoffSet set={props.sets[4]}/>}/>
        </div>
    )
}

export const LowerBrawlTwos = (props) => {
    if (props.sets.length == 0) {
        return (
            <div/>
        )
    }
    return (
        <div>
            {/* Lower Semis R1 1 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '110px'}} 
                svgStyle={{left: '160px', top: '130px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[0]}/>}/>
            {/* Lower Semis R1 2 */}
            <BracketPiece 
                slotStyle={{left: '0px', top: '350px'}} 
                svgStyle={{left: '160px', top: '370px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[1]}/>}/>
            {/* Lower Semis R2 1 */}
            <BracketPiece 
                slotStyle={{left: '200px', top: '110px'}} 
                svgStyle={{left: '360px', top: '130px'}}
                path={" M 0, 10 L 15, 10 Q 20, 10 20, 15 L 20, 125 Q 20, 130 25, 130 L 40, 130 "}
                playoffSet={<PlayoffSet set={props.sets[2]}/>}/>
            {/* Lower Semis R2 2 */}
            <BracketPiece 
                slotStyle={{left: '200px', top: '350px'}} 
                svgStyle={{left: '360px', top: '250px'}}
                path={" M 0, 130 L 15, 130 Q 20, 130 20, 125 L 20, 15 Q 20, 10 25, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[3]}/>}/>
            {/* Lower Finals */}
            <BracketPiece 
                slotStyle={{left: '400px', top: '230px'}} 
                svgStyle={{left: '560px', top: '250px'}}
                path={" M 0, 10 L 40, 10 "}
                playoffSet={<PlayoffSet set={props.sets[4]}/>}/>
            {/* Lower Decider */}
            <BracketPiece 
                slotStyle={{left: '600px', top: '230px'}}
                playoffSet={<PlayoffSet set={props.sets[5]}/>}/>
        </div>
    )
}