import { useState} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import { createUser, loginUser } from '../services/api';


const Register = ({show, handleClose, showLogin}) => {
    
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleGoogleLogin = () => {
        

    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }


    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleRegister = async () => {
        try {
            const formData = new FormData();
            formData.append("email", email)
            formData.append("user_name", username)
            formData.append("password", password)

            const newUser = await createUser(formData)

            showLogin(true)

            handleClose()


        }  catch (error) {
            console.error('Failed to register user', error)
        }
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
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder='Enter username'
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
            <Button variant="primary" onClick={handleRegister}>Sign Up</Button>
        </Modal.Footer>
    </Modal>
    )

}

export default Register;