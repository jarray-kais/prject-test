import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import api from '../services/api';

const ProtectRoute = ({children}) => {
    const [redirectMessage, setRedirectMessage] = useState("");
    const navigate = useNavigate()
    const [checkauth, setCheckauth] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        setIsLoading(true)
        api.get('/check-auth')
        .then(res=>{
            setCheckauth(res.data)
            setIsLoading(false)
    })
        .catch(()=>{
            setRedirectMessage("You are not authenticated. Please log in to access this page.")
            setIsLoading(false)
            setTimeout(() => navigate("/login"), 1000);
        })
    },[navigate])
    
    if (redirectMessage) return <p>{redirectMessage}</p> ;
  
    return (
        <>
            <LoadingSpinner loading={isLoading} />
            {!isLoading && checkauth && (checkauth.authenticated || checkauth.authorized) ? children : null}
        </>
    );
}

export default ProtectRoute