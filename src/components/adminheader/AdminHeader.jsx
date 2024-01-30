import './adminheader.scss';
import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';




export const AdminHeader = () => {
    const navigate = useNavigate();
    const api = useFetch('/user/v1/');

    const [user, setUser] = useState({});
    const { pathname } = useLocation();
    const currentUrl = pathname;
    const token = localStorage.getItem('email_or_phone');
    const rdata = {"email_or_phone": token};
    
    const handleFetchData = async () => {
        await api.postRequest('user_details', rdata);
    }

    useEffect(() => {
        if(api.data){
            setUser(api.data);
        }
    },[api.data]);

    useEffect(() => {
        handleFetchData();
    },[]);

    const clearData = () => {
        localStorage.clear();
        navigate('/signin');
    }
    return (
        <>
            <Navbar expand='lg' className='navbar_color'>
                <Container>
                    <Navbar.Brand><Link to='/' className='text-decoration-none text-dark'>RGB Play</Link></Navbar.Brand>
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
                                <Link to='/profile' className='text-decoration-none text-dark'>Proflie</Link>
                            </NavDropdown.Item>)
                        }
                        {    
                            currentUrl !== '/admin/transaction' && (
                            <NavDropdown.Item>
                                <Link to='/admin/transaction' className='text-decoration-none text-dark'>Transaction Request</Link>
                            </NavDropdown.Item>)
                        }
                        <NavDropdown.Divider />
                        <NavDropdown.Item>
                                <p  className='mb-0' onClick={clearData}>Logout</p>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Container>
            </Navbar>
        </>
    )
}
