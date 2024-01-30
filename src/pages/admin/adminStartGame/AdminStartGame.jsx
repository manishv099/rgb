import { Button, Container } from "react-bootstrap"
import { AdminMain } from "../../index"
import { useEffect, useState } from "react"
import { useFetch } from '../../../hooks/useFetch';
import { Loader } from '../../../components';
import { getApiUrl } from '../../../utils/apiConfig';
import { useNavigate } from "react-router";

export const AdminStartGame = ({setLoader, loader}) => {
    const navigate = useNavigate();
    const activeGame = getApiUrl('activeGame');
    const activeGame_api = useFetch();
    
    const deactivateGame = getApiUrl('deactivateGame');
    const getEndGame_api = useFetch();
    
    const winGame = getApiUrl('winGame');
    const getGameResult_api = useFetch();

    const api_getGameDetails = useFetch();
    const getGameDetails = getApiUrl('getGameDetails');

    const [gameStatus, setGameStatus] = useState({});
    const [timerShow, setTimerShow] = useState(true);
    const [gameEnd, setGameEnd] = useState({});
    const [gameResult, setGameResult] = useState({});
    
    const [gameRule, setGameRule] = useState({});
    
    

    const handleFetchStartGame = async () => {
        await activeGame_api.getRequest(activeGame);
    }
    const handleFetchDataGameRule = async () => {
        setLoader(true);
        await api_getGameDetails.getRequest(getGameDetails);
    }

    useEffect(()=>{
        handleFetchDataGameRule();
    },[]);

    useEffect(()=>{
        if(api_getGameDetails.data){
            setGameRule(api_getGameDetails.data);
            setLoader(api_getGameDetails.loader);
            if(api_getGameDetails.data.game_id > 0){
                setGameStatus({game_id: api_getGameDetails.data.game_id,message: "Game is already running"});
            }
        }
    },[api_getGameDetails.data]);

    const handleFetchEndGame = async () => {
        setLoader(true);
        await getEndGame_api.getRequest(deactivateGame);
    }

    const handleFetchGameResult = async () => {
        if(gameStatus && gameStatus.game_id){
            setLoader(false);
            await getGameResult_api.postRequest(winGame,{"game_id":gameStatus.game_id});
        }
    }
    useEffect(()=>{
        if(activeGame_api.data){
            setTimerShow(true);
            setGameResult({});
            setGameStatus(activeGame_api.data);
            if(activeGame_api.status400){
                setGameStatus(activeGame_api.status400);
            }
            setLoader(activeGame_api.loader);
            handleFetchDataGameRule();
            navigate('/admin/dashboard');
        }
    },[activeGame_api.data]);

    useEffect(()=>{
        if(getEndGame_api.data){
            setTimerShow(false);
            setGameEnd(getEndGame_api.data);
            const checkSetTime = () => {
                setTimeout(()=>{
                    clearTimeout(checkSetTime);
                    handleFetchGameResult();
                },3000);
            }
            checkSetTime();
        } 
    },[getEndGame_api.data]);

    useEffect(()=>{
        if(getGameResult_api.data){
            const currentTime = new Date().getTime();
            setGameStatus({});
            setGameResult(getGameResult_api.data);
        }
    },[getGameResult_api.data]);

    return (
        <>
            <AdminMain />
            <Container>
                <div className="d-flex align-items-start mb-3">
                    { gameStatus && gameStatus.game_id > 0 ? '': <Button onClick={()=>handleFetchStartGame()} className="me-3 btn-secondary">Start Game</Button>}
                    {
                        gameStatus && gameStatus.message?
                        <div>
                            <p className="mb-0">Game: <strong>{gameStatus.game_id}</strong></p>
                            <p className="mb-0">Status: <strong>{gameStatus.message}</strong></p>
                        </div>
                        :
                        ''
                    }
                </div>
                <div className="d-flex align-items-start mb-3">
                    <Button onClick={()=>handleFetchEndGame()} className="me-3 btn-success">End Game</Button>
                    {
                        gameResult && gameResult.best_color ?
                        <div>
                            <p className="mb-0">Winner Color: <strong>{gameResult.best_color}</strong></p>
                            <p className="mb-0">Total Winning Amount: <strong>{gameResult.total_winning_amount}</strong></p>
                        </div>
                        :
                        ''
                    }
                </div>
            </Container>
            { loader && <Loader />}
        </>
    )
}
