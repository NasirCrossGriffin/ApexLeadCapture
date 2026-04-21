import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Admin.css'
import { check } from './middleware/admin.ts';
import { getOrganizationByName } from './middleware/organization.ts';
import { getRealEstateQueriesByOrganization, updateRealEstateQuery } from './middleware/real-estate-query.ts';
import { getUserById } from './middleware/user.ts';
import ViewEstimate from './ViewEstimate.tsx';

function Admin() {
    const [organization, setOrganization] = useState<any>(null);
    const [inquiries, setInquiries] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<Boolean>(false);
    const [selectedRealEstateQuery, setSelectedRealEstateQuery] = useState(null);
    const [viewEstimate, setViewEstimate] = useState<Boolean>(false);

    useEffect(() => {
        const validateAdmin = async () => { 
            if (organization === null) return;
             
            try {
                const validateAdmin = await check(organization._id.toString());

                if (!(validateAdmin)) {
                    console.log("Verification failed")
                    navigate(`/admin/login`, { replace: true });
                }

                setIsAdmin(true);
                console.log("Validation Successful")
                
                return
            } catch(err) {
                console.log(err);
                setIsAdmin(false);
                navigate(`/admin/login`, { replace: true });
                return
            }
        }; 
        
        validateAdmin();
    }, [organization])

    useEffect(() => {
        async function getInquiries() {
            const protoInquiries = await getRealEstateQueriesByOrganization(organization._id);
            console.log(protoInquiries)
            setInquiries(protoInquiries);
        }; getInquiries();
    }, [isAdmin])

    useEffect(() => {
        async function getUsers() {
            const protoUsers = [];

            for (let inquiry of inquiries) {
                var protoUser = await getUserById(inquiry.user._id.toString());
                protoUsers.push(protoUser);
            }

            console.log(protoUsers);
            setUsers(protoUsers);
        }; getUsers()
    }, [inquiries])

    useEffect(() => {
        const getOrganization = async () => {
            const protoOrganization = await getOrganizationByName("test");
            console.log(protoOrganization)
            setOrganization(protoOrganization);

            return;
        }; getOrganization();
    }, [])

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

    const clickHandler = async (index : number) => {
        setSelectedRealEstateQuery(inquiries[index]);
        setViewEstimate(true);
        await updateRealEstateQuery(inquiries[index]._id, {viewed : true})
        await loadInquiries();
    }

    const navigate = useNavigate();

    async function loadInquiries() {
        const protoInquiries = await getRealEstateQueriesByOrganization(organization._id);
        console.log(protoInquiries)
        setInquiries(protoInquiries);
    }; 

    return (
        <>
            {viewEstimate ? <ViewEstimate loadInquiries={loadInquiries} realEstateQuery={selectedRealEstateQuery} setViewEstimate={setViewEstimate} organization={organization} /> : null}
            <div className='AdminDashboard'>
                {organization ? <div className='Logo'>
                    <img src={organization.logo} />
                </div> : null}

                <div className='EstimateContainer'>
                    {
                        inquiries && inquiries.length > 0 && users && users.length > 0 ? inquiries.map((inquiry : any, index : number) => (
                            <div className='Estimate' style={{borderColor: inquiry.viewed ? "black" : "rgb(0, 102, 255)", borderStyle: "solid", borderWidth: "2px", boxShadow: inquiry.viewed ? "0px 0px 0px 0px rgb(0, 0, 0, 0)" : "0px 0px 20px 10px rgb(0, 102, 255)" }} onClick={() => {clickHandler(index)}}>
                                <p>{users[index].firstName + " " + users[index].lastName}</p>
                                <p>Looking to {inquiry.service}</p>
                                <p>{formatIsoString(inquiry.createdAt)}</p>
                                <p>facing foreclosure: {(inquiry.facingForeclosure).toString()}</p>
                            </div>                     
                        )) : null
                    }
                </div>
            </div>
        </>
    )
}




    export default Admin;
