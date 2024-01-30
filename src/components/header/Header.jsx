import './header.scss';
import { useEffect, useState } from 'react';
import { Modal, Button, Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';





export const Header = () => {
    const userDetails = getApiUrl('userDetails');
    const userDetails_api = useFetch();

    const api_getGameDetails = useFetch();
    const getGameDetails = getApiUrl('getGameDetails');

    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const { pathname } = useLocation();
    const currentUrl = pathname;
    const token = localStorage.getItem('email_or_phone');
    const rdata = {"email_or_phone": token};
    
    const [showRule, setShowRule] = useState(false);
    const handleRuleShow = () => setShowRule(true);
    const handleRuleClose = () => setShowRule(false);
    const [showNews, setShowNews] = useState(false);
    const handleNewsShow = () => setShowNews(true);
    const handleNewsClose = () => setShowNews(false);
    const [gameRules, setGameRules] = useState({});
    
    const handleFetchData = async () => {
        await userDetails_api.postRequest(userDetails, rdata);
    }

    const handleFetchDataGameRule = async () => {
        await api_getGameDetails.getRequest(getGameDetails);
    }

    useEffect(() => {
        handleFetchData();
        handleFetchDataGameRule();
    },[]);

    useEffect(() => {
        if(userDetails_api.data){
            setUser(userDetails_api.data);
        }
    },[userDetails_api.data]);

    useEffect(() => {
        if(api_getGameDetails.data){
            setGameRules(api_getGameDetails.data);
        }
    },[api_getGameDetails]);

    const clearData = () => {
        localStorage.clear();
        navigate('/signin');
    }
    return (
        <>
            <Navbar expand='lg' className='navbar_color'>
                <Container>
                    <Navbar.Brand><Link to='/' className='text-decoration-none text-dark'>RGB Play</Link></Navbar.Brand>
                    <div className='d-flex align-items-center'>
                        <Button variant="success" onClick={() => handleRuleShow()}>Rules</Button>
                        <Button variant="warning" className='mx-2' onClick={() => handleNewsShow()}>News</Button>
                        <NavDropdown title={user.name} id='basic-nav-dropdown'>
                            {
                                currentUrl !== '/dashboard' && (
                                <NavDropdown.Item>
                                    <Link to='/dashboard' className='text-decoration-none text-dark'>Dashboard</Link>
                                </NavDropdown.Item>)
                            }
                            {    
                                currentUrl !== '/profile' && (
                                <NavDropdown.Item>
                                    <Link to='/profile' className='text-decoration-none text-dark'>Profile</Link>
                                </NavDropdown.Item>)
                            }
                            {    
                                currentUrl !== '/transaction' && (
                                <NavDropdown.Item>
                                    <Link to='/transaction' className='text-decoration-none text-dark'>Transaction</Link>
                                </NavDropdown.Item>)
                            }
                            <NavDropdown.Divider />
                            <NavDropdown.Item>
                                    <p  className='mb-0' onClick={clearData}>Logout</p>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </Container>
            </Navbar>
            <Modal show={showRule} onHide={handleRuleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Game Rules</Modal.Title>
                </Modal.Header>
                <Modal.Body>{gameRules.game_rule}</Modal.Body>
            </Modal>
            <Modal show={showNews} onHide={handleNewsClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Game News</Modal.Title>
                </Modal.Header>
                <Modal.Body>{gameRules.news}</Modal.Body>
            </Modal>
        </>
    )
}
