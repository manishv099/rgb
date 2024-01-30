import './admingamesetup.scss'
import { useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AdminMain } from '../../';
import { Modal, Button, Container } from 'react-bootstrap';
import { FormInput, Loader } from '../../../components';
import { useFetch } from '../../../hooks/useFetch';
import { getApiUrl, getAdminApiUrl } from '../../../utils/apiConfig';

export const AdminGameSetup = ({setLoader, loader}) => {
    const getGameDetails = getApiUrl('getGameDetails');
    const getGameDetails_api = useFetch();

    const gameDetails = getAdminApiUrl('gameDetails');
    const gameDetails_api = useFetch();

    const navigate = useNavigate();
    const token = localStorage.getItem('email_or_phone');
    const [showModel, setShowModel] = useState(false);
    useEffect(() => {
        if (!token) {
            // navigate('/admin/signin');
        }
    },[token, navigate]);
    const rdata = {"email_or_phone": token};

    const [values, setValues] = useState({
        game_rule: null,
        upi_id: null,
        news: null,
        min_recharge: null,
        min_withdraw: null,
        win_multiple: null
    });

    const formFields = [
        {
          id: 1,
          label: 'Game Rules',
          name: 'game_rule',
          type: 'text',
          placeholder: 'Enter your rules',
          autoComplete: 'off',
        },
        {
          id: 2,
          label: 'UPI ID',
          name: 'upi_id',
          type: 'text',
          placeholder: 'Enter your UPI ID',
          autoComplete: 'off',
        },
        {
          id: 3,
          label: 'News',
          name: 'news',
          type: 'text',
          placeholder: 'Enter News for user',
          autoComplete: 'off',
        },
        {
          id: 4,
          label: 'Minimum Recharge',
          name: 'min_recharge',
          type: 'number',
          placeholder: 'Enter minimum recharge user',
          autoComplete: 'off',
        },
        {
          id: 5,
          label: 'Minimum Withdraw',
          name: 'min_withdraw',
          type: 'number',
          placeholder: 'Enter minimum withdraw user',
          autoComplete: 'off',
        },
        {
          id: 6,
          label: 'Win Multiple',
          name: 'win_multiple',
          type: 'number',
          placeholder: 'Enter win multiple',
          autoComplete: 'off',
        },
    ];

    

    const changeValue = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const formSubmit = async () => {
        setLoader(true);
        await gameDetails_api.postRequest(gameDetails, values);
    };
    const handleFetchGameDetails = async () => {
        setLoader(true);
        await getGameDetails_api.getRequest(getGameDetails);
    };

    useEffect(()=>{
        handleFetchGameDetails();
    },[]);

    useEffect(()=>{
        if(getGameDetails_api.data){
            setValues(getGameDetails_api.data);
            setLoader(getGameDetails_api.loader);
        }
    },[getGameDetails_api.data]);

    useEffect(()=>{
        if(gameDetails_api.data){
            setShowModel(false);
            handleFetchGameDetails();
            setLoader(gameDetails_api.loader);
        }
    },[gameDetails_api.data]);
    
    return (
        <>
            <AdminMain />
            <Container>
                <div>
                    <h3>Amount Setup</h3>
                    <div className='profile'>
                        <Button onClick={() => setShowModel(true)} className='btn-secondary set_btn'>Edit</Button>
                        <p className='mb-0'><strong>UPI ID</strong>: <strong>{values.upi_id}</strong></p>
                        <p className='mb-0'>Game Rules: <strong>{values.game_rule}</strong></p>
                        <p className='mb-0'>News: <strong>{values.news}</strong></p>
                        <p className='mb-0'>Minimum Recharge: <strong>{values.min_recharge}</strong></p>
                        <p className='mb-0'>Minimum Withdraw: <strong>{values.min_withdraw}</strong></p>
                        <p className='mb-0'>Win Multiple: <strong>{values.win_multiple}</strong></p>
                    </div>
                </div>
            </Container>
            <Modal
                size="lg"
                show={showModel}
                onHide={() => setShowModel(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Amout Setup
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {
                            formFields.map((field)=>{
                                return <FormInput key={field.id} {...field} value={values[field.name]} changeValue={changeValue} />
                            })
                        }
                        <div className='text-center'>
                            <button className="btn btn-warning w-100" type='button' onClick={formSubmit}>Submit</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            { loader && <Loader />}
        </>
        
    )
}
