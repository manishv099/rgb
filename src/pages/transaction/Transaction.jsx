import './transaction.scss';
import { useEffect, useState } from 'react';
import { FormInput, Header, Loader } from '../../components';
import { Badge, Container, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';

export const Transaction = ({setLoader, loader}) => {
    const userTransactionHistory = getApiUrl('userTransactionHistory');
    const userTransactionHistory_api = useFetch();

    const[minimumRecharge, setMinimumRecharge] = useState(0);
    const[minimumWithdraw, setMinimumWithdraw] = useState(0);

    const userDetails = getApiUrl('userDetails');
    const userDetails_api = useFetch();
    
    const userAmountRequest = getApiUrl('userAmountRequest');
    const userAmountRequest_api = useFetch();
    
    const getGameDetails = getApiUrl('getGameDetails');
    const getGameDetails_api = useFetch();
    
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false);

    const token = localStorage.getItem('email_or_phone');
    useEffect(()=>{
        if(!token){
            navigate('/signin');
        }
    },[token, navigate]);

    const rdata = {"email_or_phone": token};
    const [show, setShow] = useState(false);
    const [addAmt, setAddAmt] = useState(true);
    const [user, setUser] = useState({});
    const [gameRule, setGameRule] = useState({});
    const [transactionHistory, setTransactionHistory]= useState([]);
    const [values, setValues] = useState({
        email_or_phone:token,
        amount:'',
        debit_or_credit:1,
        transaction_id:''
    });
    const [withdrawValues, setWithdrawValues] = useState({
        email_or_phone:token,
        amount:'',
        debit_or_credit:0,
        upi_id:''
    });

    const handleClose = () => setShow(false);
    const addAmountClick = (transacion_type) => {
        if(transacion_type == 'add'){
            setAddAmt(true);
        } else {
            setAddAmt(false);
        }
        setShow(true);
    }
    
    const tableHead = [
        {"name": "S.No."},
        {"name": "amount"},
        {"name": "Date"},
        {"name":"Settle"},
        {"name":"Status"},
        {"name":"Transaction"}
    ];
    const addAmtFormFields = [
        {
            id: 1,
            label: 'Amount',
            name: 'amount',
            type: 'number',
            min: gameRule.min_recharge,
            placeholder: 'Enter your amount',
            autoComplete: 'off',
            required: 'required'
        },
        {
            id: 2,
            label: 'Transaction ID',
            name: 'transaction_id',
            type: 'text',
            placeholder: 'Enter your transaction id',
            autoComplete: 'off',
            required: 'required'
        }
    ];
    const withdrawAmtFormFields = [
        {
            id: 1,
            label: 'Amount',
            name: 'amount',
            type: 'number',
            min: gameRule.min_withdraw,
            placeholder: 'Enter your amount',
            autoComplete: 'off',
            required: 'required'
        },
        {
            id: 2,
            label: 'UPI ID',
            name: 'upi_id',
            type: 'text',
            placeholder: 'Enter your upi id',
            autoComplete: 'off',
            required: 'required'
        }
    ];
    
    const changeValue = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
        setWithdrawValues({...withdrawValues, [e.target.name]: e.target.value});
    }

    const handleFetchData = async () => {
        setLoader(true);
        await userTransactionHistory_api.postRequest(userTransactionHistory, rdata);
    }
    
    const handleFetchDataUser = async () => {
        setLoader(true);
        await userDetails_api.postRequest(userDetails, rdata);
    }
    const handleFetchDataGameRule = async () => {
        setLoader(true);
        await getGameDetails_api.getRequest(getGameDetails, rdata);
    }

    useEffect(() => {    
        handleFetchData();
        handleFetchDataUser();
        handleFetchDataGameRule();
    },[]);

    useEffect(() => {
        if(userTransactionHistory_api.data){
            setTransactionHistory(userTransactionHistory_api.data);
            setLoader(userTransactionHistory_api.loader);
        }
    },[userTransactionHistory_api.data]);

    useEffect(() => {
        if(userDetails_api.data){
            setUser(userDetails_api.data);
            setLoader(userDetails_api.loader);
        }
    },[userDetails_api.data]);

    useEffect(() => {
        if(getGameDetails_api.data){
            setGameRule(getGameDetails_api.data);
            setLoader(getGameDetails_api.loader);
        }
    },[getGameDetails_api.data]);

    const refindData = (trans) => {
        const dateString = trans.created_at;
        const originalDate = new Date(dateString);
        const options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        };
        const formattedDate = originalDate.toLocaleDateString('en-US', options);
        return formattedDate;
    }

    const addAmount = async (e) => {
        e.preventDefault();
        setLoader(true);
        await userAmountRequest_api.postRequest(userAmountRequest, values);
    }
    const withdrawAmount = async (e) => {
        e.preventDefault();
        setLoader(true);
        await userAmountRequest_api.postRequest(userAmountRequest, withdrawValues);
    }

    useEffect(() => {
        if(userAmountRequest_api.data){
            handleFetchDataUser();
            handleFetchData();
            handleClose();
            setLoader(userAmountRequest_api.loader);
        }
    },[userAmountRequest_api.data]);
    return (
        <>
            <Header />
            <Container className='mt-3 mt-md-5'>
                <div className='summary'>
                    {loading && <p>loading...</p>}
                    <div className='d-flex justify-content-between align-items-sm-center mb-3 flex-column flex-sm-row'>
                        <div><h5 className='mb-sm-0'>Wallet Balance: <strong>{user.wallet_ballance ? user.wallet_ballance : 0 }</strong></h5></div>
                        <div className='transaction_action d-flex align-items-sm-center justify-content-center flex-column flex-sm-row'>
                            <Button className='me-1 mb-2 mb-sm-0' variant="success" onClick={()=>addAmountClick('add')}>Add Amount</Button>
                            <Button className='ms-1' onClick={()=>addAmountClick('sub')}>Withdraw Amount</Button>
                        </div>
                    </div>
                    <div className='table_record'>
                        <Table hover bordered>
                            <thead>
                                <tr>
                                    {
                                        tableHead.map((head,index)=>(
                                            <th key={head.name+'_'+index}>{head.name}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    transactionHistory.slice().reverse().map((trans,index)=>(
                                        <tr key={trans.transaction_id+'_'+index}>
                                            <td>{index+1}</td>
                                            <td>{trans.amount}</td>
                                            <td>{refindData(trans)}</td>
                                            <td>
                                                {
                                                    trans.sattle_status == 2 ?
                                                    <Badge bg='warning'>Declined</Badge>
                                                    :
                                                    <Badge bg={trans.sattle_status ? 'success' : 'danger'}>{trans.sattle_status ? 'Successful' : 'Pending'}</Badge>
                                                }
                                            </td>
                                            <td><Badge bg={trans.status ? 'success' : 'danger'}>{trans.status ? 'Credit Request' : 'Debit Request'}</Badge></td>
                                            <td>{trans.transaction_id ? trans.transaction_id : 'Debit Request'}</td>
                                        </tr>
                                    ))   
                                }
                            </tbody>
                        </Table>
                    </div>  
                </div>
                <Modal show={show} onHide={handleClose}>
                    {
                        addAmt ?
                        <form onSubmit={(e)=>addAmount(e)}>
                            <Modal.Header closeButton>
                                <Modal.Title style={{fontSize:'18px'}}>Add Amount</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='form_add'>
                                    <p>UPI ID: <strong>{gameRule.upi_id}</strong></p>
                                    {
                                        (addAmtFormFields.map((field)=>(
                                            <FormInput key={field.id} {...field} changeValue={changeValue} />
                                        )))
                                    }
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save
                                </Button>
                            </Modal.Footer>
                        </form>
                            :
                        <form onSubmit={(e)=>withdrawAmount(e)}>
                            <Modal.Header closeButton>
                                <Modal.Title style={{fontSize:'18px'}}>Withdraw Amount</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='form_add'>
                                    {
                                        (withdrawAmtFormFields.map((field)=>(
                                            <FormInput key={field.id} {...field} changeValue={changeValue} />
                                        )))
                                    }
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save
                                </Button>
                            </Modal.Footer>
                        </form>
                    }
                </Modal>
            </Container>
            { loader && <Loader />}
        </>
    )
}
