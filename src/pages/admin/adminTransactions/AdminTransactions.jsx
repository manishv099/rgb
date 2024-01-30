import { useEffect, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch';
import { getAdminApiUrl } from '../../../utils/apiConfig';
import { AdminMain } from "../../index";
import { Badge, Button, Container, Table } from 'react-bootstrap';
import { Loader } from '../../../components';

export const AdminTransactions = ({setLoader, loader}) => {
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [showTransactionHistory, setShowTransactionHistory] = useState([]);
    const adminTransactionHistory = getAdminApiUrl('adminTransactionHistory');
    const api_adminTransactionHistory = useFetch();

    const handleFetchTransactionHistory = async () => {
        setLoader(true);
        await api_adminTransactionHistory.getRequest(adminTransactionHistory);
    }

    useEffect(() => {
        handleFetchTransactionHistory();
    }, []);

    useEffect(() => {
      if(api_adminTransactionHistory.data){
        const firstShowTransactionHistory = [];
        setShowTransactionHistory([]);
        setTransactionHistory(api_adminTransactionHistory.data);
        for(let trans of api_adminTransactionHistory.data){
            if(trans.sattle_status == 1){
                if(trans.transaction_id){
                    firstShowTransactionHistory.push({'user_name':trans.user_name, 'amount':trans.amount, 'credit_debit':trans.credit_debit, 'transaction_type':trans.transaction_id});
                } else {
                    firstShowTransactionHistory.push({'user_name':trans.user_name, 'amount':trans.amount, 'credit_debit':trans.credit_debit, 'transaction_type':trans.upi_id});
                }
            }
            if(trans.sattle_status == 2){
                if(trans.transaction_id){
                    firstShowTransactionHistory.push({'user_name':trans.user_name, 'amount':trans.amount, 'credit_debit':'Reject', 'transaction_type':trans.transaction_id});
                } else {
                    firstShowTransactionHistory.push({'user_name':trans.user_name, 'amount':trans.amount, 'credit_debit':'Reject', 'transaction_type':trans.upi_id});
                }
            }
        }
        setShowTransactionHistory(firstShowTransactionHistory);
        console.log('array',firstShowTransactionHistory);
        setLoader(api_adminTransactionHistory.loader);
      }
    }, [api_adminTransactionHistory.data])
    
    

    const tableHead = [
        {"name": "S.No."},
        {"name": "User"},
        {"name": "Amount"},
        {"name": "Status"},
        {"name": "Trans. ID / UPI ID"}
    ];
    return (
        <>
            <AdminMain />
            <Container>
                <h3>User Transactions</h3>
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
                    {/* {
                        transactionHistory.map((trans,index)=>{
                        return <>
                            <tr>
                                <td>{index+1}</td>
                                <td>{trans.user_name}</td>
                                <td>{trans.amount}</td>
                                <td><Badge bg={trans.credit_debit == 'Credit' ? 'success' : 'danger'}>{trans.credit_debit}</Badge></td>
                                <td>{trans.transaction_id ? trans.transaction_id : trans.upi_id}</td>
                            </tr>
                        </>
                        })   
                    } */}
                    {
                        showTransactionHistory.map((trans,index)=>{
                        return <>
                            <tr>
                                <td>{index+1}</td>
                                <td>{trans.user_name}</td>
                                <td>{trans.amount}</td>
                                <td>
                                    {
                                        trans.credit_debit == 'Reject' ?
                                        <Badge bg='warning'>{trans.credit_debit}</Badge>
                                        :
                                        <Badge bg={trans.credit_debit == 'Credit' ? 'success' : 'danger'}>{trans.credit_debit}</Badge>
                                    }
                                </td>
                                <td>{trans.transaction_type}</td>
                            </tr>
                        </>
                        })   
                    }
                    </tbody>
                    </Table>
                </div>  
            </Container>
            { loader && <Loader />} 
        </>
    )
}
