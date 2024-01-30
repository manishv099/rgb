import './signup.scss';
import {useEffect,useState} from 'react';
import { Loader } from '../../components/index';
import {FormInput} from '../../components';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';
import { auth } from '../../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SignUp = ({setLoader, loader}) => {
  const userSignup = getApiUrl('userSignup');
  const userSignup_api = useFetch();

  const navigate = useNavigate();
  const token = localStorage.getItem('email_or_phone');

  const [errorFind, setErrorFind] = useState('');
  
  useEffect(()=>{
    setLoader(false);
  },[]);
  useEffect(()=>{
      if(token){
          navigate('/dashboard');
      }
  },[token, navigate]);

  const [number, setNumber] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [otpFlag, setOtpFlag] = useState(false);
  const [otp, setOtp] = useState("");

  const formFields = [
    {
      id: 1,
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter your name',
      autoComplete: 'off',
      required: 'required'
    },
    {
      id: 2,
      label: 'Phone',
      name: 'phnno',
      type: 'number',
      placeholder: 'Enter your phone',
      autoComplete: 'off',
      required: 'required'
    },
    {
      id: 3,
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      autoComplete: 'off',
      required: 'required'
    },
    {
      id: 4,
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Enter your password',
      autoComplete: 'off',
      required: 'required'
    },
    {
      id: 5,
      label: 'Confirm Password',
      name: 'confirm_password',
      type: 'password',
      placeholder: 'Enter your confirm password',
      autoComplete: 'off',
      required: 'required'
    },
    {
      id: 6,
      label: 'Referal Code',
      name: 'referal_code',
      type: 'text',
      placeholder: 'Enter your Referal Code',
      autoComplete: 'off'
    }
  ];

  const [values, setValues] = useState({
      name:'',
      phnno:'',
      email:'',
      password:'',
      confirm_password:'',
      referal_code:''
  });

  const changeValue = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  }
  const addNumber = () => {
    setValues({...values, phnno: number});
  }

  const formSubmitValidate = async (e) => {
    console.error(values);
    let hitApi = false;
    if(values.phnno.length < 12){
      hitApi = false;
      setErrorFind('Please enter the valid phone number!');
    } else {
      hitApi = true;
      setErrorFind('');
    }
    e.preventDefault();
    if(hitApi){
      console.log('proceed for otp send',values);
      handleSendOTP();
      // submitFormAPI();
    }
  }

  let formErrorMesseage = '';
  const formSubmitValidateTry = () => {
    if(!values.name){
      formErrorMesseage = 'Please enter the valid name!';
      toast(formErrorMesseage);
    } else if(!values.phnno){
      formErrorMesseage = 'Please enter the valid phone number!';
      toast(formErrorMesseage);
    } else if(!values.email){
      formErrorMesseage = 'Please enter the valid email!';
      toast(formErrorMesseage);
    } else if(!values.password){
      formErrorMesseage = 'Please enter the password!';
      toast(formErrorMesseage);
    } else if(values.password != values.confirm_password){
      formErrorMesseage = 'Password does not match!';
      toast(formErrorMesseage);
    } else {
      handleSendOTP();
    }
  }

  const submitFormAPI = async () => {
    setLoader(true);
    await userSignup_api.postRequest(userSignup, values);
  }

  useEffect(()=>{},[number]);
  useEffect(()=>{},[errorFind]);
  // const formSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoader(true);
  //   await userSignup_api.postRequest(userSignup, values);
  //   console.log('error found!',userSignup_api.errorData);
  // }

  
  const handleSendOTP = async () => {
    const formValues = JSON.stringify(values);
    localStorage.setItem('signupForm',formValues);
    setLoader(true);
    try {
      const recaptcha = new RecaptchaVerifier(auth,"sign-in-button",{
        'size': 'invisible',
        'callback': (response) => {
          handleSendOTP();
      }});
      const result = await signInWithPhoneNumber(auth,number,recaptcha);
      setVerificationId(result);
      setOtpFlag(true);
      setLoader(false);
      console.log('OTP sent successfully!');
    } catch (err) {
      setOtpFlag(false);
      setLoader(false);
      toast(err);
      console.error('Error sending OTP:', err);
    }
  };

  const handleVerifyOTP = async () => {
    const formValues = localStorage.getItem('signupForm');
    const objectFormValues = JSON.parse(formValues);
    setLoader(true);
    setValues(objectFormValues);
    if(errorFind === ''){
      try {
        const result = await verificationId.confirm(otp);
        console.log('values',values);
        toast('OTP verified successfully!');
        submitFormAPI();
        // console.log(result);
        setOtpFlag(false);
        setLoader(false);
        console.log('OTP verified successfully!');
      } catch (err) {
        setLoader(false);
        toast('Incorrect OTP');
        console.error('Error verifying OTP:', err);
      }
    }
  };

  useEffect(() => {
    console.log('submit function')
    if(userSignup_api.data){
      localStorage.removeItem("signupForm");
      setLoader(userSignup_api.loader);
      console.log('erro',userSignup_api.errorData);
      navigate('/signin');
    }
  },[userSignup_api.data]);

  useEffect(() => {
    console.log('submit function')
    if(userSignup_api.errorData){
      localStorage.removeItem("signupForm");
      setLoader(userSignup_api.loader);
      toast(userSignup_api.errorData);
    }
  },[userSignup_api.errorData]);

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
                    <p className='mb-0'>Register Now!</p>
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
                <>
                  <div className='form mb-4 pt-0'>
                    <small className='text-danger'>{errorFind}</small>
                    {/* <form onSubmit={(e)=> formSubmitValidate(e)}> */}
                    {/* <form> */}
                      {
                        formFields.map((field)=>{
                          return <FormInput key={field.id} {...field} addNumber={addNumber} setNumber={setNumber} changeValue={changeValue} />
                        })
                      }
                      <button id="sign-in-button" className="btn btn-warning w-100" type='button' onClick={formSubmitValidateTry}>Try Submit</button>
                    {/* </form> */}
                    {/* <button id="sign-in-button" className="btn btn-warning w-100" type='button' onClick={handleSendOTP}>Submit</button> */}
                  </div>
                  <div className='btm_strip d-flex justify-content-between flex-column-reverse align-items-center'>
                    <p className='mb-0'><small>Already have an account?</small> <Link to="/signin" className='text-decoration-none text-primary'>Sign in</Link></p>
                  </div>
                </>
              }
              {/* <div className='form mb-4 pt-0'>
                <small className='text-danger'>{errorFind}</small>
                <form onSubmit={(e)=> formSubmit(e)}>
                {
                    formFields.map((field)=>{
                        return <FormInput key={field.id} {...field} addNumber={addNumber} setNumber={setNumber} changeValue={changeValue} />
                    })
                }
                  <button id="sign-in-button" className="btn btn-warning w-100" type='submit'>Submit</button>
                </form>
              </div>
              <div className='btm_strip d-flex justify-content-between flex-column-reverse align-items-center'>
                <p className='mb-0'><small>Already have an account?</small> <Link to="/signin" className='text-decoration-none text-primary'>Sign in</Link></p>
              </div> */}
            </div>
          </div>
        </Container>
        <ToastContainer/>
        { loader && <Loader />}
        </>
    )
}
