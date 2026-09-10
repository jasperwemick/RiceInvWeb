import type { CSSProperties } from "react";
import useProfiles from "../../../components/Profile/hooks/useProfiles";
import DrawableImage from "./DrawableImage";

const passageTextStyle : CSSProperties = {
    fontFamily : 'sans-serif',
    fontSize : '1.5pc',
    color : '#252c33ff'
}

const pageButton : CSSProperties = {
    border : '0.5rem solid #091c50', 
    borderRadius : '2rem', 
    background : 'linear-gradient(#aabbcc, #6f70c9)',
    fontFamily : 'sans-serif',
    fontSize : '2pc',
    color : '#252c33ff',
    alignContent : 'center',
}

export default function MeInfo({ stage, progress, localProgress } : { stage : number, progress : number, localProgress : number }) {

    const { profiles } = useProfiles();
    return (
        <div className={`me-section`} style={{background : 'transparent'}}>
            <div className={`me-left ${stage !== 0 ? 'me-hidden' : ''}`} style={{opacity : progress >= 0 ? localProgress : 0}}>
                <DrawableImage src={profiles.find(x => x.name === 'Jasper Emick')?.imageUrl}/>
                <div className={`me-base-grid-block`}>
                    <p style={{
                        color : '#041629ff',
                        border : '0.5rem solid #a18c48ff',
                        borderRadius : '1.5rem',
                        padding : '1rem',
                        textAlign : 'center',
                        fontSize : '3pc'
                    }}>{`The Host`}</p>
                </div>
                <div className={`me-base-grid-block`}>
                    <p style={{
                        color : '#041629ff',
                        textAlign : 'center',
                        fontSize : '2.5pc',
                        fontStyle : 'italic'
                    }}>
                        {`Jasper Emick`}
                    </p>
                </div>
            </div>
            <div className={`me-right ${stage < 1 ? 'me-hidden' : ''}`} style={{opacity : progress >= 1 ? localProgress : 0}}>
                <div className={`${stage < 2 ? 'me-hidden' : ''}`} style={{
                    ...({opacity : progress >= 2 ? stage === 2 ? localProgress : 1 : 0}),
                    gridColumn : '1 / -1',
                    border : '0.5rem solid #091c50', 
                    borderRadius : '2rem', 
                    background : 'linear-gradient(#aabbcc, #6f70c9)',
                    padding : '1rem'}}>
                    <p style={{ ...passageTextStyle, textAlign : 'left', margin : '0 0 1rem 0'}}>
                        {`Hello! Welcome to my website. This is a place where I compile things I've created or plan on creating.
                        This is the new future direction for this site. Up until this point it was primarily focused on the Rice Inviational, 
                        hence the domain name`}
                    </p>
                    <p style={{ ...passageTextStyle, textAlign : 'left', margin : '0 0 1rem 0'}}>
                        {`The Rice Invitational was originally a gaming tournament I made up with about twenty or so of my friends that we regularly participated
                        in for about two years. It wasn't really all that organized; rather, it was just something to do for fun and bring us all together. 
                        Even though it might all seem a bit silly, especially since it didn't really officially conclude in any way, I believe it was a 
                        worthwhile experience as long as there was fun had together.`}
                    </p>
                    <p style={{ ...passageTextStyle, textAlign : 'left', margin : '0 0 1rem 0'}}>
                        {`If you want more information regarding any of this stuff consider clicking one of the buttons below`}
                    </p>
                </div>
                <div className={`${stage < 3 ? 'me-hidden' : ''}`} style={{
                    ...({opacity : progress >= 3 ? stage === 3 ? localProgress : 1 : 0}),
                    display : 'grid',
                    gridTemplateColumns : 'subgrid',
                    gridColumn : '1 / -1'}}>
                    <button style={{...pageButton, gridColumn : '1 / 3'}}><p>{`More Rice Invitational`}</p></button>
                    <button style={{...pageButton, gridColumn : '3 / 5'}}><p>{`Other Projects`}</p></button>
                    <button style={{...pageButton, gridColumn : '5 / 7'}}><p>{`For Employers`}</p></button>
                </div>
            </div>
        </div>
    )
}