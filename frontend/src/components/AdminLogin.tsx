import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import '../styles/AdminLogin.css'
import { authenticateAdmin } from './middleware/admin.ts';
import { getOrganizationByName } from './middleware/organization.ts';

function AdminLogin() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [organization, setOrganization] = useState<any>(null);

    useEffect(() => {
        const getOrganization = async () => {
            const protoOrganization = await getOrganizationByName('test');
            console.log(protoOrganization)
            setOrganization(protoOrganization);

            return;
        }; getOrganization();
    }, [])

    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log("entered")

        if (!(organization)) return

        console.log("there was indeed a bodyshop")

        const loginData = {
            username : username,
            password : password,
            organization : organization._id
        }

        console.log(loginData);

        try {
            const authenticate = await authenticateAdmin(loginData);

            console.log("This part of the code was reached")
            console.log(authenticate);

            if (authenticate) {
                console.log("Success")
                navigate(`/admin`, { replace: true });
            }
        } catch(err) {
            console.log("try failed")
            console.log(err)
        return
        }
    }

    return (
        <>
            <div className='AdminLogin'>
                <div className='LoginForm'>
                    <h1>Admin Login</h1>
                    {organization ? <h1>{organization.displayName}</h1> : null }
                    {organization ? <div className='OrgLogo'><img src={organization.logo}/></div> : null}
                    <label htmlFor='username'>Username: </label>
                    <input placeholder='Username' onChange={(e) => {setUsername(e.currentTarget.value)}} name='username'></input>
                    <label htmlFor='password' typeof='password'>Password: </label>
                    <input placeholder='Password' name='password' type='password' onChange={(e) => {setPassword(e.currentTarget.value)}}></input>
                    <button onClick={() => {handleLogin()}}>Submit</button>
                </div>
            </div>
        </>
    )
}


    export default AdminLogin;
