import './dashboard.scss';
import { Modal, Container, Table, Badge, Button } from 'react-bootstrap';
import { Header, Loader } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';

export const Dashboard = ({setLoader, loader}) => {
    const gameStartTiming = 11 * 60 * 1000;
    const setMinuteTiming = 1;
    const gameDeactiveTiming = '01:00';

    const api_userGameHistory = useFetch();
    const api_userGameHistory2 = useFetch();
    const userGameHistory = getApiUrl('userGameHistory');

    const api_getGameDetails = useFetch();
    const api_getGameDetailsDublicate = useFetch();
    const getGameDetails = getApiUrl('getGameDetails');
    
    const chooseColor = getApiUrl('chooseColor');
    const api_gameSubmit = useFetch();
    
    const deactivateGame = getApiUrl('deactivateGame');
    const api_deactivateGame = useFetch();
    
    const winGame = getApiUrl('winGame');
    const api_winGame = useFetch();

    const userDetails = getApiUrl('userDetails');
    const userDetails_api = useFetch();

    const [apiError, setApiError] = useState('');
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [newGameshow, setNewGameshow] = useState(false);
    const [showErrorModel, setShowErrorModel] = useState(false);
    const handleClose = () => {
        setShow(false);
        setNewGameshow(false);
        setShowErrorModel(false);
    };
    

    const [gameResultAPIMessage,setGgameResultAPIMessage] = useState('You Won!');

    const navigate = useNavigate();
    const [gameRule, setGameRule] = useState({});
    const [counterTime, setCounterTime] = useState('');
    const [gameBetMessage, setGameBetMessage] = useState('');
    const [counterEffect, setCounterEffect] = useState(0);
    const token = localStorage.getItem('email_or_phone');
    const color_Set = ['Red','Blue','Green'];
    useEffect(() => {
        if (!token) {
          navigate('/signin');
        }
    },[token, navigate]);
    const rdata = {"email_or_phone": token};

    const popupSetting = {
        gameResult: false,
        news: false,
        rules: false
    }

    const [modelSetting, setModelSetting] = useState(popupSetting);

    const handleShow = (type) => {
        setModelSetting(popupSetting);
        if(type === 'rules'){
            modelSetting.news = true;
        }
        console.log(modelSetting);
        setShow(true);
    }
    
    const user_selected_color = {
        "email_or_phone":token,
        "game_id": null,
        "color_one": {
            "color": null,
            "amount": null
        },
        "color_two": {
            "color": null,
            "amount": null
        }
    }
    
    const [colors, setColors] = useState([]);
    const [userSelectColors, setUserSelectColors] = useState(user_selected_color);
    const [transactionHistory, setTransactionHistory]= useState([]);

    const handleColorClick = (color) => {
        if(counterTime < gameDeactiveTiming){
            return;
        }
        if (colors.includes(color)) {
            setColors(colors.filter((selectedColor) => selectedColor !== color));
            if (userSelectColors.color_one.color === color.substring(0,1)) {
                setUserSelectColors({
                ...userSelectColors,
                color_one: {
                    color: null,
                    amount: null
                }
                });
            } else if (userSelectColors.color_two.color === color.substring(0,1)) {
                setUserSelectColors({
                    ...userSelectColors,
                    color_two: {
                    color: null,
                    amount: null
                    }
                });
            }
        } else {
            if (colors.length < 2) {
                setColors([...colors, color]);
            }
            if (!userSelectColors.color_one.color) {
                setUserSelectColors({
                  ...userSelectColors,
                  color_one: {
                    color: color.substring(0,1),
                    amount: null
                  }
                });
                return;
            }
            if (!userSelectColors.color_two.color) {
                setUserSelectColors({
                    ...userSelectColors,
                    color_two: {
                    color: color.substring(0,1),
                    amount: null
                    }
                });
                return;
            }
        }
    };

    const handleFetchData = async () => {
        setLoader(true);
        await api_userGameHistory.postRequest(userGameHistory, rdata);
    }

    const handleFetchDataGameHistory = async () => {
        setLoader(true);
        await api_userGameHistory2.postRequest(userGameHistory, rdata);
    }

    const handleFetchDataGameRule = async () => {
        console.log('hit one');
        setLoader(true);
        await api_getGameDetails.getRequest(getGameDetails);
    }

    const handleFetchDataGameRuleDublicate = async () => {
        console.log('hit one');
        setLoader(true);
        await api_getGameDetailsDublicate.getRequest(getGameDetails);
    }

    const handleFetchDataGameSubmit = async () => {
        if(counterTime < gameDeactiveTiming){
            return;
        }
        setLoader(true);
        await api_gameSubmit.postRequest(chooseColor,userSelectColors);
    }


    const handleFetchDataWinGame = async () => {
        await api_winGame.postRequest(winGame,{"game_id":gameRule.game_id});
    }

    const handleFetchDataDeactivateGame = async () => {
        await api_deactivateGame.getRequest(deactivateGame);
    }

    const handleFetchUserDetailsData = async () => {
        setLoader(true);
        await userDetails_api.postRequest(userDetails, rdata);
    }
    
    useEffect(() => {
        handleFetchData();
        handleFetchUserDetailsData();
        handleFetchDataGameRule();
    },[]);

    useEffect(() => {
        if(userDetails_api.data){
            setUser(userDetails_api.data);
            setLoader(userDetails_api.loader);
        }
    },[userDetails_api.data]);

    useEffect(() => {
        if(api_userGameHistory.data){
            setTransactionHistory(api_userGameHistory.data);
            setLoader(api_userGameHistory.loader);
        }
    },[api_userGameHistory.data]);

    useEffect(() => {
        if(api_userGameHistory2.data){
            handleFetchUserDetailsData();
            const lastValue = api_userGameHistory2.data.length - 1;
            console.log('working fine',api_userGameHistory2.data[lastValue]);
            console.log('working fine 1',api_userGameHistory2.data.length);
            if(api_userGameHistory2.data[lastValue].color_one === api_userGameHistory2.data[lastValue].win_color
            ||
            api_userGameHistory2.data[lastValue].color_two === api_userGameHistory2.data[lastValue].win_color){
                setGgameResultAPIMessage('You Won!');
            } else {
                setGgameResultAPIMessage('You Lost!');
            }
            setUserSelectColors(user_selected_color);
            setCounterTime('');
            setGameBetMessage('');
            setShow(true);

            setTransactionHistory(api_userGameHistory2.data);
            setLoader(api_userGameHistory2.loader);
        }
    },[api_userGameHistory2.data]);

    useEffect(() => {
        if(api_winGame.data){
            handleFetchUserDetailsData();
            if(userSelectColors.color_one.color == api_winGame.data.best_color || userSelectColors.color_two.color == api_winGame.data.best_color){
                setGgameResultAPIMessage('You Won!');
            } else {
                setGgameResultAPIMessage('You Lost!');
            }
            localStorage.removeItem("bet");
            setCounterTime('');
            setGameBetMessage('');
            setShow(true);
        }
    },[api_winGame.data]);

    useEffect(() => {
        console.error('hit two');
        if(api_getGameDetails.data){
            console.error('hit final');
            setGameRule(api_getGameDetails.data);
            if(api_getGameDetails.data.count_down){
                setGameBetMessage('');
            }
            const serverTime = new Date(gameRule.count_down).getTime();
            const startTime = serverTime + gameStartTiming;
            const currentTime = new Date().getTime();
            if(currentTime <= startTime){
                gameTiming(startTime);
            }
            setUserSelectColors({
                ...userSelectColors,
                game_id: api_getGameDetails.data.game_id
            });

            const localDataCheck = localStorage.getItem("bet");
            if(localDataCheck){
                const localDataCheck1 = JSON.parse(localDataCheck);
                if(api_getGameDetails.data.game_id == localDataCheck1.game_id){
                    setGameBetMessage('Best of Luck');
                    setUserSelectColors(localDataCheck1);
                } else {
                    localStorage.removeItem("bet");
                }
                if(api_getGameDetails.data.game_id == null){
                    localStorage.removeItem("bet");
                }
            }
            setLoader(api_getGameDetails.loader);
        }
    },[api_getGameDetails.data]);
    
    useEffect(() => {
        console.error('hit two');
        if(api_getGameDetailsDublicate.data){
            console.error('hit final');
            setGameRule(api_getGameDetailsDublicate.data);
            if(api_getGameDetailsDublicate.data.count_down){
                setGameBetMessage('');
            }
            const serverTime = new Date(gameRule.count_down).getTime();
            const startTime = serverTime + gameStartTiming;
            const currentTime = new Date().getTime();
            if(currentTime <= startTime){
                gameTiming(startTime);
            }
            setUserSelectColors({
                ...userSelectColors,
                game_id: api_getGameDetailsDublicate.data.game_id
            });

            const localDataCheck = localStorage.getItem("bet");
            if(localDataCheck){
                const localDataCheck1 = JSON.parse(localDataCheck);
                if(api_getGameDetailsDublicate.data.game_id == localDataCheck1.game_id){
                    setGameBetMessage('Best of Luck');
                    setUserSelectColors(localDataCheck1);
                } else {
                    localStorage.removeItem("bet");
                }
                if(api_getGameDetailsDublicate.data.game_id == null){
                    localStorage.removeItem("bet");
                }
            }
            if(api_getGameDetailsDublicate.data.game_id == null){
                setNewGameshow(true);
                console.log('new game null',newGameshow);
            }
            setLoader(api_getGameDetailsDublicate.loader);
        }
    },[api_getGameDetailsDublicate.data]);

    const gameTiming = (getTime) => {
        const timeIntervalFn = setInterval(() => {
            const currentTime = new Date().getTime();
            const remaining = getTime - currentTime;
            const minutes = Math.floor(remaining / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
            if(minutes == 0 && seconds == 0){
                setCounterTime('');
            }
            if(minutes == setMinuteTiming && seconds == 0){
                // handleFetchDataDeactivateGame();
            }
            if (minutes <= 0 && seconds <= 0) {
                clearInterval(timeIntervalFn);
                if(gameRule.game_id > 0){
                    for(let i = 0; i < 1; i++){
                        if(i == counterEffect){
                            // handleFetchDataWinGame();
                            setTimeout(()=>{
                                handleFetchDataGameHistory();
                            },6000);
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

    useEffect(() => {
        if(api_gameSubmit.data){
            localStorage.setItem('bet',JSON.stringify(userSelectColors));
            setGameBetMessage(api_gameSubmit.data.message);
            setLoader(api_gameSubmit.loader);
            if(api_gameSubmit.errorData){
                setShowErrorModel(true);
                setApiError(api_gameSubmit.errorData)
            }
        }
    },[api_gameSubmit.data]);

    const handleBetAmtChange = (color, amount) => {
        amount = Number(amount);
        if(userSelectColors.color_one.color === color.substring(0,1)){
            setUserSelectColors({
              ...userSelectColors,
              color_one: {
                ...userSelectColors.color_one,
                amount: amount
              }
            });
            return;
        }
        
        if(userSelectColors.color_two.color === color.substring(0,1)){
            setUserSelectColors({
              ...userSelectColors,
              color_two: {
                ...userSelectColors.color_two,
                amount: amount
              }
            });
            return;
        }
      };

    const refindData = (trans) => {
        const dateString = trans.created_at;
        const originalDate = new Date(dateString);
        const options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        };
        return originalDate.toLocaleDateString('en-US', options);
    }
    
    const tableHead = [
        {"name": "Game"},
        {"name": "Date"},
        {"name":"Win Amount"},
        {"name":"Result"},
        {"name":"Win Color"}
    ];

    return (
        <>
            <Header />
            <Container>
                <div className='mb-3 mb-md-5 mt-3 mt-md-5'>
                    <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                        <h3 className='mb-0 text-secondary'>{counterTime}</h3>
                        <h4 className='mb-0'>Elimination</h4>
                    </div>
                    <div className='color_boxs mb-3'>
                        {
                            
                            color_Set.map((color,index)=>{
                                let color_class = '';

                                if (color === 'Blue') {
                                color_class = 'bg-primary';
                                } else if (color === 'Red') {
                                color_class = 'bg-danger';
                                } else if (color === 'Green') {
                                color_class = 'bg-success';
                                }
                                return <div key={color+'_'+index}><div className={`${color_class} mx-2 circle`} onClick={() => handleColorClick(color)} style={{border: colors.includes(color) ? '2px dashed #000' : 'none' }}>
                                        <small className='text-uppercase'>{color}</small>
                                    </div>
                                    {
                                        colors.includes(color) && counterTime > gameDeactiveTiming ?
                                        <input
                                        type='number' className='form-control'
                                        onChange={(e) => handleBetAmtChange(color, e.target.value)}
                                        /> :
                                        <div style={{height:'47px'}}></div>
                                    }
                                    </div>
                            })
                        }
                    </div>
                    { gameBetMessage != '' && <p className='text-center text-success'>{gameBetMessage} {userSelectColors.color_one.color && userSelectColors.color_one.color && <> Your bet is: {userSelectColors.color_one.color} = {userSelectColors.color_one.amount}</>} {userSelectColors.color_two.color && userSelectColors.color_two.color && <> and {userSelectColors.color_two.color} = {userSelectColors.color_two.amount} </>} </p>}
                    <div className='d-flex flex-column align-items-center justify-content-center'>
                        <Button onClick={()=>handleFetchDataGameSubmit()} className={counterTime < gameDeactiveTiming ? 'disabled' : ''} disabled={counterTime < gameDeactiveTiming}>Submit</Button>
                    </div>
                    {
                        counterTime < gameDeactiveTiming && counterTime > '00:00' ? <p className='text-danger text-center mb-0'><strong>Time Up Color is locked</strong></p> : ''
                    }
                </div>
                <div className='summary'>
                    <div className='d-flex justify-content-between flex-column-reverse flex-md-row mb-3'>
                        <div className='d-flex'>
                            <h4 className='mb-0 d-flex align-items-center '><span className='me-2'>Game Record</span> {counterTime === '' && <span className='btn btn-success' onClick={()=>handleFetchDataGameRuleDublicate()}>New Game</span>}</h4>
                        </div>
                        <div className='d-flex align-items-end mb-3 mb-md-0'>
                            <span>Wallet Balance:</span><h3 className='mb-0'>{user.wallet_ballance}</h3>
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
                            {transactionHistory.slice().reverse().map((trans,index) => (
                                <>
                                { trans.win_color &&
                                    <tr key={index + 1}>
                                        <td>{trans.game_id}</td>
                                        <td>{refindData(trans)}</td>
                                        <td>{trans.reward}</td>
                                        <td>
                                            <Badge bg={trans.reward > 0 ? 'success' : 'danger'}>
                                                {trans.reward > 0 ? 'Won' : 'Lost'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {
                                                trans.win_color === 'G' && <Badge bg='success'>&nbsp;</Badge>
                                            }
                                            {
                                                trans.win_color === 'R' && <Badge bg='danger'>&nbsp;</Badge>
                                            }
                                            {
                                                trans.win_color === 'B' && <Badge bg='primary'>&nbsp;</Badge>
                                            }
                                        </td>
                                    </tr>
                                }
                                </>
                            ))}
                        </tbody>
                    </Table>
                    </div>
                </div>
            </Container>
            <div></div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header className={ gameResultAPIMessage == 'You Won!' ? 'bg-success modelPopUp' : 'bg-danger modelPopUp'} >
                    <Modal.Title>{gameResultAPIMessage}</Modal.Title>
                </Modal.Header>
            </Modal>
            <Modal show={newGameshow} onHide={handleClose}>
                <Modal.Body>
                    <p className='mb-0 text-center'>No running game</p>
                    <p className='mb-0 text-center'>Please try after sometime!</p>
                </Modal.Body>
            </Modal>
            <Modal show={showErrorModel} onHide={handleClose}>
                <Modal.Body>
                    <p className='text-danger mb-0 text-center'>{apiError}</p>
                </Modal.Body>
            </Modal>
            { loader && <Loader />}
        </>
    )
}
