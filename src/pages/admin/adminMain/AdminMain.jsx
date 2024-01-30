import './adminmain.scss';
import { useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';

export const AdminMain = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('email_or_phone');
  useEffect(() => {
      if (!token) {
        navigate('/admin/signin');
      }
  },[token, navigate]);
  const rdata = {"email_or_phone": token};

  const signOut = () => {
    localStorage.clear();
    navigate('/admin/signin');
}
  
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  RGB Play
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className='position-relative'>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link><Link to="/admin/dashboard" className='text-decoration-none text-dark'>Dashboard</Link></Nav.Link>
                  <Nav.Link><Link to="/admin/game" className='text-decoration-none text-dark'>Game Setup</Link></Nav.Link>
                  <Nav.Link><Link to="/admin/transaction_request" className='text-decoration-none text-dark'>User Transactions Request</Link></Nav.Link>
                  <Nav.Link><Link to="/admin/transactions" className='text-decoration-none text-dark'>Transactions History</Link></Nav.Link>
                  <Nav.Link><Link to="/admin/game_setup" className='text-decoration-none text-dark'>Amount Setup</Link></Nav.Link>
                </Nav>
                <div className='signout'>
                  <Link className='text-decoration-none text-dark' onClick={()=>signOut()}>Sign Out</Link>
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}
