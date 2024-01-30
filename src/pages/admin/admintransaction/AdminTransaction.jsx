import './transaction.scss'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from '../../../hooks/useFetch';
import { AdminMain } from "../../index"
import { Modal, Badge, Button, Container, Table } from "react-bootstrap";
import { Loader } from '../../../components';
import { getAdminApiUrl } from '../../../utils/apiConfig';

export const AdminTransaction = ({setLoader, loader}) => {
  const adminUserHistory = getAdminApiUrl('adminUserHistory');
  const adminUserHistory_api = useFetch();
  
  const adminSattle = getAdminApiUrl('adminSattle');
  // const adminSattle_api = useFetch('/admin/v1');
  const adminSattle_api = useFetch();

  const navigate = useNavigate();
  const creditUpdateData = {
    "user_id": null,
    "debit_or_credit": null,
    "request_id": null,
    "reject":false
  }

  const [transactionHistory, setTransactionHistory]= useState([]);
  const [creditUPdate, setCreditUPdate]= useState(creditUpdateData);
  const [show, setShow] = useState(false);
  const [creditAmt, setCreditAmt] = useState(true);
  const [creditAmtUpdate, setCreditAmtUpdate] = useState(true);
  const [debitAmtUpdate, setDebitAmtUpdate] = useState(true);
  const [resMessage, setResMessage] = useState(null);
  const handleClose = () => setShow(false);
  
  const handleFetchData = async () => {
    setLoader(true);
    await adminUserHistory_api.getRequest(adminUserHistory);
  }

  const handleUpdateAmt = async () => {
    setLoader(true);
    await adminSattle_api.postRequest(adminSattle,creditUPdate);
  }

  useEffect(() => {    
    handleFetchData();
  },[]);

  useEffect(() => {
    if(adminUserHistory_api.data){
      setTransactionHistory(adminUserHistory_api.data);
      setLoader(adminUserHistory_api.loader);
    }
  },[adminUserHistory_api.data]);

  useEffect(() => {
    if(adminSattle_api.data){
      handleFetchData();
      handleClose();
      setResMessage(adminSattle_api.data.message);
      setLoader(adminSattle_api.loader);
    }
  },[adminSattle_api.data]);

  const amtUpdate = (transacion_type,req_id,user_id,reject) => {
    if(transacion_type == 1){
      setCreditAmt(true);
      setCreditUPdate({...creditUPdate, debit_or_credit: transacion_type,request_id:req_id,user_id:user_id,reject:reject});
      setCreditAmtUpdate(reject);
    } else {
      setCreditUPdate({...creditUPdate, debit_or_credit: transacion_type,request_id:req_id,user_id:user_id,reject:reject});
      setDebitAmtUpdate(reject);
      setCreditAmt(false);
    }
    setShow(true);
  }
  
  useEffect(()=>{
  },[debitAmtUpdate,creditAmtUpdate,creditAmt,creditUPdate]);

  const tableHead = [
    {"name": "S.No."},
    {"name": "Status"},
    {"name": "amount"},
    // {"name": "Request ID"},
    {"name": "User"},
    {"name": "Trans. ID / UPI ID"},
    // {"name": "Total Balance"},
    {"name": "Action"}
  ];

  return (
    <>
      <AdminMain />
      <Container>
        <h3>User Transaction Request</h3>
        <div className='table_record'>
          <Table hover bordered>
            <thead>
                <tr>
                    {
                        tableHead.map((head)=>{
                            return <th>{head.name}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
              {
                  transactionHistory.slice().reverse().map((trans,index)=>{
                  return <>
                      <tr>
                          <td>{index+1}</td>
                          <td><Badge bg={trans.credit_debit == 'Credit' ? 'success' : 'danger'}>{trans.credit_debit}</Badge></td>
                          <td>{trans.amount}</td>
                          {/* <td>{trans.request_id}</td> */}
                          <td>{trans.user_name}</td>
                          <td>{trans.transaction_id ? trans.transaction_id : trans.upi_id}</td>
                          {/* <td>{trans.total_available_balance_per_user}</td> */}
                          <td>
                            {
                              trans.credit_debit == 'Credit' ?
                              <>
                                <Button className='mb-0 me-2' variant="success" onClick={()=>amtUpdate(1,trans.request_id,trans.user_id,false)}>Accept</Button>
                                <Button className='mb-0' variant="danger" onClick={()=>amtUpdate(1,trans.request_id,trans.user_id,true)}>Decline</Button>
                              </>
                              :
                              <>
                                <Button className='mb-0 me-2' variant="danger" onClick={()=>amtUpdate(0,trans.request_id,trans.user_id,false)}>Accept</Button>
                                <Button className='mb-0' variant="success" onClick={()=>amtUpdate(0,trans.request_id,trans.user_id,true)}>Decline</Button>
                              </>
                            }
                          </td>
                      </tr>
                  </>
                  })   
              }
            </tbody>
            </Table>
        </div>  
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title style={{fontSize:'18px'}}>{creditAmt ? 'Credit Amount Verify' : 'Debit Amount Send'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='form_add'>
                {
                  creditAmt ? 
                  <>
                  {
                    creditAmtUpdate ?
                    <p className='text-danger'>Are you sure want to credit amount is decline in your account?</p>
                    :
                    <p className='text-success'>Are you sure want to credit amount is update in your account?</p>
                  }
                  </>
                  :
                  <>
                  {
                    debitAmtUpdate ?
                    <p className='text-success'>Are you sure want to debit amount is decline in your account?</p>
                    :
                    <p className='text-danger'>Are you sure want to debit amount is update in your account?</p>
                  }
                  </>
                }
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            {
              creditAmt ?
              <Button variant="primary" onClick={()=>handleUpdateAmt()}>
                  Save
              </Button>
              :
              <Button variant="primary" onClick={()=>handleUpdateAmt()}>
                  Save
              </Button>
            }
        </Modal.Footer>
      </Modal>
      { loader && <Loader />}
    </>
  )
}
