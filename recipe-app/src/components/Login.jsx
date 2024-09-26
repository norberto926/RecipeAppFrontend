import { useState, useContext} from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import { loginUser } from '../services/api';
import { useJwt, decodeToken} from "react-jwt"
import { UserContext } from '../services/UserContext';


const Login = ({show, handleClose, showLogin}) => {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [decodedToken, setDecodedToken] = useState(null);

    const { setUserId } = useContext(UserContext);

    const handleGoogleLogin = () => {
        

    }

    

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }


    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async () => {
        try {
            const formData = new FormData();
            formData.append("email", email)
            formData.append("password", password)

            const userTokens = await loginUser(formData)

            if (userTokens && userTokens.access) {
                const decoded = decodeToken(userTokens.access);

                console.log(decoded)

                if (decoded && decoded.user_id) {
                    setUserId(decoded.user_id)
                    console.log("User ID set in context:", decoded.id);
                }
                else {
                    console.log("Failed to decode token")
                }
                    
            }

            handleClose()
        }  catch (error) {
            console.error('Failed to login user', error)
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