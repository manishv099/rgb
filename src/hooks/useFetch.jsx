import axios from 'axios';
import { useState } from 'react';

export const useFetch = () => {

    const [data, setData] = useState(null);
    const [errorData, setErrorData] = useState(null);
    const [loader, setLoader] = useState(true);
    
    const sendRequest = async (url, method, requestData) => {
        const headers = {
            'Content-Type': 'application/json'
        };
        setLoader(true);
        // let response;
        // if (method === 'POST') {
        //     response = await axios.post(url, requestData, { headers });
        // } else if (method === 'GET') {
        //     response = await axios.get(url, { headers });
        // } else {
        //     console.error('Unsupported HTTP method');
        //     return;
        // }
        // if(response.status === 200){
        //     setData(response.data);
        // }
        // if(response.status === 400){
        //     setError(response.data);
        // }
        // if(response.status === 200 || response.status === 400){
        //     setLoader(false);
        // }
        // console.error('response',response.status);
        try {
            let response;
            if (method === 'POST') {
                response = await axios.post(url, requestData, { headers });
            } else if (method === 'GET') {
                response = await axios.get(url, { headers });
            } else {
                console.error('Unsupported HTTP method');
                return;
            }
            setData(response.data);
            setLoader(false);
        } catch (error) {
            setErrorData(null);
            // if(error.response.status == 400){
            //     setStatus400(error.response.data);
            // }
            // if(error.response.status == 401){
            //     setStatus401(error.response.data);
            // }
            if(error.response && error.response.status == 400){
                setLoader(false);
                console.log('error 400',error.response.data);
                setErrorData(error.response.data);
            }
            if(error.response.status == 401 || error.response.status == 404){
                console.error('Error during API request 231564:', error.response.status);
                setLoader(false);
                setErrorData(error.response.data);
            }
            console.error('Error during API request:', error.response.status);
        } finally {
            setLoader(false);
        }
    };

    const postRequest = (url, requestData) => sendRequest(url, 'POST', requestData);
    const getRequest = (url) => sendRequest(url, 'GET');

    return { data, loader, errorData, postRequest, getRequest };
};