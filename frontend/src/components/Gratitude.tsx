import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import '../styles/Gratitude.css'
import { getOrganizationByName } from './middleware/organization.ts';

function Gratitude() {
    const [organizationState, setOrganizationState] = useState<any>(null);

    useEffect(() => {
        const getOrganizationState = async () => {
            const protoOrganizationState = await getOrganizationByName('test');
            console.log(protoOrganizationState)
            setOrganizationState(protoOrganizationState);

            return;
        };  getOrganizationState();
    }, [])
    
    return (
        <>
            <div className='Gratitude'>
                {organizationState ? <div className='Logo'>
                    <img src={organizationState.logo} />
                </div> : null}

                <div className='GratitudeContainer fade-in-slide-up'>
                    <h1>Thank You!</h1> 
                    {organizationState ? <h2>{organizationState.displayName} has received your request.</h2> : null}
                    <h2>Please check your email.</h2>
                </div>
            </div>
        </>
    )
}


    export default Gratitude;
