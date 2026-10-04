import useProfiles from "../../../components/Profile/hooks/useProfiles";
import DrawableImage from "./DrawableImage";
import { Link } from "wouter";

export default function MeInfo({ stage, progress, localProgress } : { stage : number, progress : number, localProgress : number }) {

    const { profiles } = useProfiles();
    return (
        <div className={`me-section`} style={{background : 'transparent', pointerEvents : 'none'}}>
            <div className={`me-left ${stage !== 0 ? 'me-hidden' : ''}`} style={{opacity : progress >= 0 ? localProgress : 0}}>
                <DrawableImage src={profiles.find(x => x._id === "65791c0c79e6998e4df5da2c")?.imageUrl}/>
                <div className={'me-left-text-group'}>
                    <div className={`me-base-grid-block`}>
                        <p className={'me-face-text'}>{`Jasper Emick`}</p>
                    </div>
                    <div className={`me-base-grid-block`}>
                        <p className={'me-face-text'}>{`Invitationalist`}</p>
                    </div>
                </div>
            </div>
            <div className={`me-right ${stage < 1 ? 'me-hidden' : ''}`} style={{opacity : progress >= 1 ? localProgress : 0}}>
                <ul className={`${stage < 2 ? 'me-hidden' : ''}`} style={{
                    ...({opacity : progress >= 2 ? stage === 2 ? localProgress : 1 : 0})
                    }}>
                    <li>
                        <p className={'me-passage-text'} style={{ textAlign : 'center', fontSize : '32pt'}}>
                            {`Hello! Welcome to my website!`}
                        </p>
                    </li>
                    <li>
                        <p className={'me-header-text'}>{`What is This Place?`}</p>
                        <p className={'me-passage-text'} style={{ textAlign : 'left'}}>
                            {`This is a place where I compile things I've created or plan on creating. Up until this point it was primarily focused on the Rice Invitational,
                            hence the domain name. Now, it also serves as my personal space for other projects and whatnot.`}
                        </p>
                    </li>
                    <li>
                        <p className={'me-header-text'}>{`Rice Invitational?`}</p>
                        <p className={'me-passage-text'} style={{ textAlign : 'left'}}>
                            {`The Rice Invitational was originally a gaming tournament I made up with about twenty or so of my friends that we regularly participated
                            in for about two years. It wasn't really all that organized; rather, it was just something to do for fun and bring us all together. 
                            At one point this site was used for scheduling matches and showcasing playres... but that didn't really last!`}
                        </p>
                    </li>
                    <li>
                        <p className={'me-header-text'}>{`What's Happening Now?`}</p>
                        <p className={'me-passage-text'} style={{ textAlign : 'left'}}>
                            {`I'm currently working on reintroducing all of the data I recorded from the Invitational back onto this site in interesting ways. I've had to
                            redesign both the frontend and backend of this site entirely so it will take some time, but come check for updates every now and then if interested!
                            If you want more information regarding any of this stuff consider clicking one of the buttons below (Once they actually lead somewhere). Thanks!`}
                        </p>
                    </li>
                </ul>
                <div className={`${stage < 3 ? 'me-hidden' : ''}`} style={{
                    ...({opacity : progress >= 3 ? stage === 3 ? localProgress : 1 : 0})
                    }}>
                    <Link className={'me-page-button'} style={{ gridColumn : '1 / 3'}} to={`/`}><p>{`Rice Invitational`}</p></Link>
                    <Link className={'me-page-button'} style={{ gridColumn : '3 / 5'}} to={`/`}><p>{`Other Projects`}</p></Link>
                    <Link className={'me-page-button'} style={{ gridColumn : '5 / 7'}} to={`/`}><p>{`For Employers`}</p></Link>
                </div>
            </div>
        </div>
    )
}