import { useState, useEffect } from 'react';
import { Loader } from '../../../components';
import { AdminMain } from '../../';
import { Table, Container } from 'react-bootstrap';
import { useFetch } from '../../../hooks/useFetch';
import { getApiUrl } from '../../../utils/apiConfig';

export const AdminDashboard = ({setLoader, loader}) => {
  const gameStartTiming = 11 * 60 * 1000;
  const setMinuteTiming = 1;

  const userList = getApiUrl('userList');
  const userList_api = useFetch();

  const api_getGameDetails = useFetch();
  const getGameDetails = getApiUrl('getGameDetails');

  const deactivateGame = getApiUrl('deactivateGame');
  const api_deactivateGame = useFetch();

  const winGame = getApiUrl('winGame');
  const api_winGame = useFetch();


  const [userListing, setUserListing] = useState([]);
  const [adminGame, setAdminGame] = useState({});

  const [counterTime, setCounterTime] = useState('');
  const [counterDeactivate, setCounterDeactivate] = useState(0);
  const [counterEffect, setCounterEffect] = useState(0);

  const handleFetchAllUsers = async () => {
    setLoader(true);
    await userList_api.getRequest(userList);
  };

  const handleFetchDataGameRule = async () => {
    setLoader(true);
    await api_getGameDetails.getRequest(getGameDetails);
  }

  const handleFetchDeactivateGame = async () => {
    await api_deactivateGame.getRequest(deactivateGame);
  }

  const handleFetchWinGame = async () => {
    if(adminGame && adminGame.game_id){
      setLoader(false);
      await api_winGame.postRequest(winGame,{"game_id":adminGame.game_id});
    }
  }

  useEffect(() => {
    handleFetchAllUsers();
    handleFetchDataGameRule();
  },[]);

  useEffect(() => {
    if(userList_api.data){
      setUserListing(userList_api.data);
      setLoader(userList_api.loader);
    }
  },[userList_api.data]);

  useEffect(() => {
    if(api_getGameDetails.data){
      setAdminGame(api_getGameDetails.data);
      setLoader(api_getGameDetails.loader);
      const serverTime = new Date(api_getGameDetails.data.count_down).getTime();
      const startTime = serverTime + gameStartTiming;
      const currentTime = new Date().getTime();
      if(currentTime <= startTime){
          gameTiming(startTime);
      }
    }
  },[api_getGameDetails.data]);

  const tableHead = [
    {"name": "S.No."},
    {"name": "Name"},
    {"name": "Email"},
    {"name": "Phone"},
    {"name": "Balance"}
  ];

  const gameTiming = (getTime) => {
    const timeIntervalFn = setInterval(() => {
      const currentTime = new Date().getTime();
      const remaining = getTime - currentTime;
      const minutes = Math.floor(remaining / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      if(minutes == 0 && seconds == 0){
          setCounterTime('00:00');
      }
      if(minutes == setMinuteTiming && seconds == 0){
        if(adminGame.game_id > 0){
          for(let i = 0; i < 1; i++){
            if(i == counterDeactivate){
              handleFetchDeactivateGame();
            }
            let countit = counterDeactivate-1;
            setCounterDeactivate(countit);
          }
        }
      }
      if (minutes <= 0 && seconds <= 0) {
        clearInterval(timeIntervalFn);
        if(adminGame.game_id > 0){
          for(let i = 0; i < 1; i++){
            if(i == counterEffect){
              handleFetchWinGame();
            }
            let countit = counterEffect-1;
            setCounterEffect(countit);
          }
        }
        return;
      }
      const ct = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      if(minutes >= 0 && seconds > 0){
          setCounterTime(ct);
      }
    }, 1000);
  }

  useEffect(()=>{
    if(api_winGame.data){
        setCounterTime('');
        setLoader(api_winGame.loader);
    }
  },[api_winGame.data]);

  return (
    <>
        <AdminMain />
        <Container className='mt-3'>
          <div>
            <div className='d-flex justify-content-between align-items-end mb-3'>
              <h3 className='mb-0'>User List</h3>
              <h1>{counterTime}</h1>
              <div className='d-flex align-items-end'>
                <span>Available Balance:</span><h3 className='mb-0'>{adminGame.avalable_balance}</h3>
              </div>
            </div>
            <div className='table_record'>
              <Table hover bordered>
                  <thead>
                      <tr>
                          {tableHead.map((head,index) => (
                              <th key={head.name + '_' + index}>{head.name}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {userListing.map((user,index) => (
                          <tr key={index + 1}>
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.phnno}</td>
                              <td>{user.wallet_balance}</td>
                          </tr>
                      ))}
                  </tbody>
              </Table>
            </div>
          </div>
        </Container>
        { loader && <Loader />}
    </>
  )
}
