import './profile.scss';
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { Header, Loader } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';

export const Profile = ({setLoader, loader}) => {
    const userDetails = getApiUrl('userDetails');
    const userDetails_api = useFetch();

    const navigate = useNavigate();
    const token = localStorage.getItem('email_or_phone');
    useEffect(()=>{
        if(!token){
            navigate('/signin');
        }
    },[token, navigate]);
    const rdata = {"email_or_phone": token};
    const [user, setUser] = useState({});
    const [profile, setProfile] = useState('');

    const getInitials = (user) => {
        const initials = user.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase();
        return initials;
    };

    const handleFetchData = async () => {
        setLoader(true);
        await userDetails_api.postRequest(userDetails, rdata);
    }

    useEffect(() => {    
        handleFetchData();
    },[]);

    useEffect(() => {
        if(userDetails_api.data){
            setUser(userDetails_api.data);
            setProfile(getInitials(userDetails_api.data));
            setLoader(userDetails_api.loader);
        }
    },[userDetails_api.data]);

    return (
        <>
            <Header />
            <Container className='mt-3 mt-md-5'>
                <div className='profile'>
                    <div className='profile_photo bg-primary'><span>{profile}</span></div>
                    <h4><strong>Name: </strong> {user.name}</h4>
                    <p className='mb-0'><strong>Email: </strong> {user.email}</p>
                    <p className='mb-0'><strong>Phone: </strong> {user.phnno}</p>
                    <p className='mb-0'><strong>Wallet Balence: </strong> {user.wallet_ballance}</p>
                    {
                        user.referal_balance != null && <p className='mb-0'><strong>Referral Balance: </strong> {user.referal_balance}</p>
                    }<p className='mb-0'><strong>Referral ID: </strong> {user.referal_code}</p>
                </div>
            </Container>
            { loader && <Loader />}
        </>
    )
}
