import './adminsignIn.scss';
import { useEffect, useState } from 'react';
import { FormInput } from '../../../components';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { getAdminApiUrl } from '../../../utils/apiConfig';

export const AdminSignIn = () => {
    
    const adminSignin = getAdminApiUrl('adminSignin');
    const adminSignin_api = useFetch();
    
    const navigate = useNavigate();

    const formFields = [
        {
          id: 1,
          label: 'Email/Phone',
          name: 'email',
          type: 'text',
          placeholder: 'Enter your email/phone',
          autoComplete: 'off',
        },
        {
          id: 2,
          label: 'Password',
          name: 'password',
          type: 'password',
          placeholder: 'Enter your password',
          autoComplete: 'off',
        },
    ];

    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const changeValue = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const formSubmit = async () => {
        await adminSignin_api.postRequest(adminSignin, values);
    };

    useEffect(() => {
        if(adminSignin_api.data){
            localStorage.setItem('email_or_phone',adminSignin_api.data.user);
            navigate('/admin/dashboard');
        }
    },[adminSignin_api.data]);

    useEffect(() => {
        const token = localStorage.getItem('email_or_phone');
        if(token){
          navigate('/admin/dashboard');
        }
    },[navigate]);

    return (
        <Container>
            <div className='f_form'>
                <div className='f_box'>
                    <div className='text-center mb-0 mb-md-5'>
                        <h1 className='mb-0'>RGB Play</h1>
                        <p className='mb-0'>Be more!!</p>
                    </div>
                    <div className='form mb-4'>
                        {adminSignin_api.errorData && <small className='text-danger'>{adminSignin_api.errorData.mssages}</small> }
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
                        <p className='mb-0'><Link to="/signup" className='text-decoration-none text-secondary'><small>Forget Password</small></Link></p>
                    </div>
                </div>
            </div>
        </Container>
    )
}
