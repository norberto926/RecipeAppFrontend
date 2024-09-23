import { Link } from 'react-router-dom';
import { Navbar, Nav, Button} from 'react-bootstrap';
import { useState, useContext } from 'react';
import Login from './Login';
import Register from './Register';
import { UserContext } from '../services/UserContext';


const AppNavbar = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] =  useState(false)

  const { userId } = useContext(UserContext);

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleClose = () => {
    setShowLogin(false)
    setShowRegister(false)
  }


  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">Recipe App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/recipes">Recipes</Nav.Link>
          <Nav.Link as={Link} to="/ingredients">Ingredients</Nav.Link>
          
          {userId ? (<span>Welcome {userId}</span>) : (
            <>
          <Button variant="primary" onClick={handleShowRegister}>Sign up</Button>
          <Button variant="primary" onClick={handleShowLogin}>Sign in</Button>
        </>)
          }
          
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {showLogin&& <Login show={showLogin} handleClose={handleClose}/>}
    {showRegister&& <Register show={showRegister} handleClose={handleClose} showLogin={setShowLogin}/>}
    </>
  );
};

export default AppNavbar;