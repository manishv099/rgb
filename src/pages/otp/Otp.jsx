import './signin.scss';
import { useEffect, useState } from 'react';
import { FormInput } from '../../components';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';

export const Otp = () => {
    const api_userSignin = useFetch();
    const userSignin = getApiUrl('userSignin');
    const navigate = useNavigate();

    const formFields = [
        {
          id: 1,
          label: 'OTP',
          name: 'otp',
          type: 'number',
          placeholder: 'Enter your otp',
          autoComplete: 'off',
        }
    ];

    const [values, setValues] = useState({
        email_or_phone: '',
        password: ''
    });

    const changeValue = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const formSubmit = async () => {
        await api_userSignin.postRequest(userSignin, values);
    };

    useEffect(() => {
        if(api_userSignin.data){
            localStorage.setItem('email_or_phone',api_userSignin.data.user);
            navigate('/dashboard');
        }
    },[api_userSignin.data]);

    useEffect(() => {
        const token = localStorage.getItem('email_or_phone');
        if(token){
          navigate('/dashboard');
        }
    },[navigate]);

    return (
        <Container>
            <div className='f_form'>
                <div className='f_box'>
                    <div className='text-center mb-0 mb-md-5'>
                        <h1 className='mb-0'>RGB Play</h1>
                        <p className='mb-0'>OTP verification!</p>
                    </div>
                    <div className='form mb-4'>
                        {
                            formFields.map((field)=>{
                                return <FormInput key={field.id} {...field} changeValue={changeValue} />
                            })
                        }
                        <div className='text-center'>
                            <button className="btn btn-warning w-100" type='button' onClick={formSubmit}>Submit</button>
                        </div>
                    </div>
                    <div className='btm_strip d-flex justify-content-between flex-column-reverse align-items-center'>
                        <p className='mb-0'><small>Don't have an account?</small> <Link to="/signup" className='text-decoration-none text-primary'>Sign Up</Link></p>
                        <p className='mb-0'><Link to="/signin" className='text-decoration-none text-secondary'><small>Sign In</small></Link></p>
                    </div>
                </div>
            </div>
        </Container>
    )
}
