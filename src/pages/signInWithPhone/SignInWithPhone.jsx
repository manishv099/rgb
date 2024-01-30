import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth';

export const SignInWithPhone = () => {
    const navigate = useNavigate();

    const [number, setNumber] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [otp, setOtp] = useState("");
    // const [codeVerification, setCodeVerification] = useState('');
    // const [idVerification, setVerifi] = useState(null);

    const handleSendOTP = async () => {
      try {
        const recaptcha = new RecaptchaVerifier(auth,"sign-in-button",{
          'size': 'invisible',
          'callback': (response) => {
            handleSendOTP();
        }});
        const result = await signInWithPhoneNumber(auth,number,recaptcha);
        setVerificationId(result);
        console.log('OTP sent successfully!');
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    };
  
    const handleVerifyOTP = async () => {
      try {
        const result = await verificationId.confirm(otp);
        console.log(result);
        console.log('OTP verified successfully!');
      } catch (error) {
        console.error('Error verifying OTP:', error);
      }
    };


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
                        <p className='mb-0'>Be more!!</p>
                    </div>
                    <div className='form mb-4'>
                      <PhoneInput defaultCountry="IN" placeholder="Enter phone number" value={number} onChange={setNumber}/>
                      <div id="recaptcha"></div>
                      <button id="sign-in-button" onClick={handleSendOTP}>Send OTP</button>
                    </div>
                    <div className='form mb-4'>
                      <input type='number' value={otp} onChange={(e) => setOtp(e.target.value)} />
                      <div id="recaptcha"></div>
                      <button onClick={handleVerifyOTP}>Verify OTP</button>
                    </div>
                    <div className='btm_strip d-flex justify-content-between flex-column-reverse align-items-center'>
                        <p className='mb-0'><small>Don't have an account?</small> <Link to="/signup" className='text-decoration-none text-primary'>Sign Up</Link></p>
                        <p className='mb-0'><Link to="/forget_password" className='text-decoration-none text-secondary'><small>Forget Password</small></Link></p>
                    </div>
                </div>
            </div>
        </Container>
    )
}