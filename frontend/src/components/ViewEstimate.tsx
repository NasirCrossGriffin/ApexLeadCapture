import React, { useEffect, useState } from 'react';
import '../styles/ViewEstimate.css';
import { getUserById } from './middleware/user';
import { GetRealEstatePhotos } from './middleware/real-estate-photo';
import { createEstimate } from './middleware/estimate';
import { createResponseCotact } from './middleware/contact';
import { deleteRealEstateQuery } from './middleware/real-estate-query';

function ViewEstimate({
    loadInquiries,
    realEstateQuery,
    setViewEstimate,
    organization
} : {
    loadInquiries : Function;
    realEstateQuery: any;
    setViewEstimate: React.Dispatch<React.SetStateAction<Boolean>>;
    organization : any
}) {
    const [user, setUser] = useState<any>(null);
    const [realEstateQueryPhotos, setEstimatePhotos] = useState<Array<any>>([]);
    const [realEstateQueryPrice, setEstimatePrice] = useState<string>("");
    const [completedEstimate, setCompletedEstimate] = useState<any>(null);
    const [realEstateQueryPriceValidator, setEstimatePriceValidator] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)
    const [responseSent, setResponseSent] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        console.log(organization);
    }, [organization])

    useEffect(() => {
        if (realEstateQuery) {
            const getUser = async () => {
                const foundUser = await getUserById(realEstateQuery.user._id);
                console.log(foundUser);
                setUser(foundUser);
            }; 

            const getAllEstimatePhotos = async () => {
                const realEstateQueryPhotos = await GetRealEstatePhotos(realEstateQuery._id);
                setEstimatePhotos(realEstateQueryPhotos);
            };
            
            getUser(); getAllEstimatePhotos();
        }
    }, [realEstateQuery])

    const formatIsoString = (value: string) => {
        if (!value || value.trim().length === 0) return '';

        const d = new Date(value);
        if (isNaN(d.getTime())) return value; // fallback: show raw if invalid

        return d.toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const generateRealEstateResponse = async () => {
        if (!(user && realEstateQuery && organization)) return;

        const newResponseContact = {
            email : user.email,
            firstname : user.firstName,
            service : realEstateQuery.service,
            address : realEstateQuery.address,
            city : realEstateQuery.city,
            state : realEstateQuery.state,
            zipCode : realEstateQuery.zipCode,
            organization : organization._id,
            message : message
        }

        const completedContact = await createResponseCotact(newResponseContact);

        if (completedContact) {
            setLoading(false);
            setResponseSent(true);
        }
    }

    const clickHandler = async () => {
        setLoading(true)
        await generateRealEstateResponse()
    };

    const normalizePriceString = (value: string) => {
    // remove $ and commas and whitespace
    return value.replace(/\$/g, '').replace(/,/g, '').trim();
    };

    const parseEstimatePrice = (value: string) => {
        const normalized = normalizePriceString(value);
        if (normalized.length === 0) return null;

        const num = Number(normalized);
        if (!Number.isFinite(num)) return null;
        if (num < 0) return null;

        return num;
    };

    const validateEstimatePrice = (value: string) => {
        const parsed = parseEstimatePrice(value);
        return parsed === null ? 'Enter a valid numeric price (e.g. 2500 or $2,500)' : '';
    };

    const deleteHandler = async () => {
        const deleted = await deleteRealEstateQuery(realEstateQuery._id)

        if (deleted) {
            loadInquiries();
            setViewEstimate(false);
        }
    }
        
    return (
        <>
            {realEstateQuery ? <div className='ViewEstimate'>
                <div className='Background' onClick={() => setViewEstimate(false)}></div>
                <div className='ViewEstimateContainer'>
                    <div className='ContentContainer'>
                        {realEstateQuery && user ? <div className='EstimateInformation'>
                            <div className='EstimateField'>
                                <h3>Request Created At:</h3>
                                <p>{formatIsoString(realEstateQuery.createdAt)}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Appointment Date and Time:</h3>
                                <p>{formatIsoString(realEstateQuery.consultationDate)}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Name:</h3>
                                <p>{user.firstName + " " + user.lastName}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Email:</h3>
                                <p>{user.email}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Phone Number:</h3>
                                <p>{user.phoneNumber}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Address:</h3>
                                <p>{realEstateQuery.address}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>City:</h3>
                                <p>{realEstateQuery.city}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>State:</h3>
                                <p>{realEstateQuery.state}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Zip Code:</h3>
                                <p>{realEstateQuery.zipCode}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Service</h3>
                                <p>{realEstateQuery.service}</p>
                            </div>

                            <div className='EstimateField'>
                                <h3>Facing foreclosure:</h3>
                                <p>{realEstateQuery.facingForeclosure ? "Yes" : "No"}</p>
                            </div>

                            {
                                realEstateQuery.facingForeclosure ? 
                                <>
                                    <div className='EstimateField'>
                                        <h3>Loan Balance:</h3>
                                        <p>{realEstateQuery.currentLoanBalance}</p>
                                    </div> 

                                    <div className='EstimateField'>
                                        <h3>Amount Behind:</h3>
                                        <p>{realEstateQuery.amountBehind}</p>
                                    </div> 

                                    <div className='EstimateField'>
                                        <h3>Loan Type:</h3>
                                        <p>{realEstateQuery.loanType}</p>
                                    </div> 

                                    <div className='EstimateField'>
                                        <h3>Lender Name:</h3>
                                        <p>{realEstateQuery.lenderName}</p>
                                    </div>

                                    <div className='EstimateField'>
                                        <h3>Auction Date:</h3>
                                        <p>{realEstateQuery.auctionDate ? realEstateQuery.auctionDate : "N/A"}</p>
                                    </div>
                                </>: null
                            }
                        </div> : null}

                        {realEstateQuery ? <div className='Description'>
                            <p>{realEstateQuery.description}</p>
                        </div> : null}

                        <div className='EstimatePhotosContainer'>
                            {realEstateQuery && realEstateQueryPhotos.length > 0 ? <div className='EstimatePhotos'>
                                {realEstateQueryPhotos.map((realEstateQueryPhoto, index) => (<div className='EstimatePhoto' key={index}>
                                    <img src={realEstateQueryPhoto.url}/>
                                </div>))}
                            </div> : <h1>No Photos Uploaded</h1>}
                        </div>

                        <div className='LeadCapture'>
                            <h1>Respond to the lead</h1>
                            <textarea value={message} onInput={(e) => {setMessage(e.currentTarget.value)}} />
                            <div>
                                <>{ loading === false && responseSent === false ? <button onClick={() => {clickHandler()}}>Respond</button> : null }</>
                                <>{ loading && responseSent === false ? <div className='LoadingIcon'><img src="/images/loading.png" /></div> : null }</>
                                <>{ responseSent ? <div className='ResponseSent'><h2 style={{color : "green"}}>Response sent successfully</h2></div> : null }</>
                            </div>
                        </div>

                        <button style={{
                            backgroundColor : "red",
                            color : "white",
                            fontFamily : "Montserrat",
                            fontSize : window.innerHeight < window.innerWidth ? "2vw" : "4vw",
                            marginTop : window.innerHeight < window.innerWidth ? "0" : "20vw",
                            borderRadius : "35px"
                        }} className='RemoveButton' onClick={() => {deleteHandler()}}>
                            Remove
                        </button>

                        {realEstateQueryPriceValidator !== '' ? (
                                <p className="Validator">{realEstateQueryPriceValidator}</p>
                                ) : null}

                        {completedEstimate ? <p className='EstimateSent'>The realEstateQuery was sent to the customer</p> : null}
                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default ViewEstimate;
