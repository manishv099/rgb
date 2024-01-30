import './signin.scss';
import { useEffect, useState } from 'react';
import { FormInput, Loader } from '../../components';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';
import { auth } from '../../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ForgetPassword = ({setLoader,loader}) => {
    const [number, setNumber] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [otpFlag, setOtpFlag] = useState(false);
    const [otp, setOtp] = useState("");
    
    const api_forgetPassword = useFetch();
    const forgetPassword = getApiUrl('forgetPassword');
    const navigate = useNavigate();
    
    useEffect(()=>{
        setLoader(false);
    },[]);
    const formFields = [
        {
          id: 1,
          label: 'Phone',
          name: 'phone',
          type: 'number',
          placeholder: 'Enter your phone',
          autoComplete: 'off',
        },
        {
          id: 1,
          label: 'New Password',
          name: 'new_password',
          type: 'password',
          placeholder: 'Enter new password',
          autoComplete: 'off',
        }
    ];

    const [values, setValues] = useState({
        phone: '',
        new_password: ''
    });

    const changeValue = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const addNumber = () => {
        setValues({...values, phone: number});
    }

    const formSubmit = async () => {
        await api_forgetPassword.postRequest(forgetPassword, values);
    };

    const handleSendOTP = async () => {
        const formValues = JSON.stringify(values);
        localStorage.setItem('forgetForm',formValues);
        setLoader(true);
        try {
          const recaptcha = new RecaptchaVerifier(auth,"forget-btn-id",{
            'size': 'invisible',
            'callback': (response) => {
              handleSendOTP();
          }});
          const result = await signInWithPhoneNumber(auth,number,recaptcha);
          setVerificationId(result);
          setOtpFlag(true);
          setLoader(false);
          toast("OTP sent successfully");
          console.log('OTP sent successfully!');
        } catch (err) {
          setLoader(false);
          toast("Try after sometime");
          console.error('Error sending OTP:', err);
        }
    };
    
    const handleVerifyOTP = async () => {
        const formValues = localStorage.getItem('forgetForm');
        const objectFormValues = JSON.parse(formValues);
        setLoader(true);
        setValues(objectFormValues);
          try {
            const result = await verificationId.confirm(otp);
            console.log('values',values);
            formSubmit();
            // console.log(result);
            setLoader(false);
            console.log('OTP verified successfully!');
          } catch (err) {
            toast('Incorrect OTP');
            console.error('Error verifying OTP:', err);
          }
    };

    useEffect(() => {
        if(api_forgetPassword.data){
            navigate('/signin');
        }
    },[api_forgetPassword.data]);

    useEffect(() => {
        if(api_forgetPassword.errorData){
            toast(api_forgetPassword.errorData);
            navigate('/forget_password');
        }
    },[api_forgetPassword.errorData]);

    useEffect(() => {
        const token = localStorage.getItem('email_or_phone');
        if(token){
          navigate('/dashboard');
        }
    },[navigate]);

    return (
        <>
        <Container>
            <div className='f_form'>
                <div className='f_box'>
                    <div className='text-center mb-0 mb-md-5'>
                        <h1 className='mb-0'>RGB Play</h1>
                        {
                            otpFlag ?
                            <p className='mb-0'>Verify OTP!</p>
                            :
                            <p className='mb-0'>Forget Password!</p>
                        }
                    </div>
                    {
                        otpFlag ?
                        <div className='form mb-4'>
                            <div className='mb-3'>
                                <label>OTP</label>
                                <input className='form-control' type='number' value={otp} onChange={(e) => setOtp(e.target.value)}  />
                            </div>
                            <div className='text-center'>
                                <button className="btn btn-warning w-100" type='button' onClick={handleVerifyOTP}>Submit</button>
                            </div>
                        </div>
                        :
                        <div className='form mb-4'>
                            {
                                formFields.map((field)=>{
                                    return <FormInput key={field.id} {...field} addNumber={addNumber} setNumber={setNumber} changeValue={changeValue} />
                                })
                            }
                            <div className='text-center'>
                                <button id="forget-btn-id" className="btn btn-warning w-100" type='button' onClick={handleSendOTP}>Submit</button>
                            </div>
                        </div>
                    }
                    <div className='btm_strip d-flex justify-content-between flex-column-reverse align-items-center'>
                        <p className='mb-0'><small>Don't have an account?</small> <Link to="/signup" className='text-decoration-none text-primary'>Sign Up</Link></p>
                        <p className='mb-0'><Link to="/signin" className='text-decoration-none text-secondary'><small>Sign In</small></Link></p>
                    </div>
                </div>
            </div>
        </Container>
        { loader && <Loader />}
        <ToastContainer />
        </>
    )
}
