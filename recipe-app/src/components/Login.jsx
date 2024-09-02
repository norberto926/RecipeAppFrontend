import { useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';


const Login = ({show, handleClose}) => {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleGoogleLogin = () => {
        

    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }


    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = () => {
        
    }



    return (
        <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder='Enter email'
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Paswsword</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder='Enter password'
                    />
                </Form.Group>
               </Form>
               <Button variant="primary" onClick={handleGoogleLogin}>Sign in with google</Button>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={handleLogin}>Login</Button>
        </Modal.Footer>
    </Modal>
    )

}

export default Login;