import { Link } from 'react-router-dom';
import { Navbar, Nav, Button} from 'react-bootstrap';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';


const AppNavbar = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] =  useState(false)

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleClose = () => {
    setShowLogin(false)
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
          <Button variant="primary" onClick={handleShowRegister}>Sign up</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {showLogin&& <Login show={showLogin} handleClose={handleClose}/>}
    {showRegister&& <Register show={showRegister} handleClose={handleClose}/>}
    </>
  );
};

export default AppNavbar;