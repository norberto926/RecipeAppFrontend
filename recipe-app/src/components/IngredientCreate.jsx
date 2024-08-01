import { useState, useCallback } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createIngredient } from '../services/api';
import { useDropzone } from 'react-dropzone';

const IngredientCreate = ({ show, handleClose }) => {
    const [ingredientName, setIngredientName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [protein, setProtein] = useState(null)
    const [carbohydrates, setCarbohydrates] = useState(null)
    const [fat, setFat] = useState(null)


    const handleIngredientNameChange = (e) => {
        setIngredientName(e.target.value);
    };

    const handleProteinChange = (e) => {
        setProtein(e.target.value);
    };

    const handleCarbohydratesChange = (e) => {
        setCarbohydrates(e.target.value);
    };

    const handleFatChange = (e) => {
        setFat(e.target.value);
    };


    const calculateCalories = () => {
        const calories = protein * 4 + carbohydrates * 4 + fat * 9
        return calories
    };

    const onDrop = useCallback((acceptedFiles) => {
        setPhoto(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', ingredientName);
            formData.append('protein', protein);
            formData.append('carbohydrates', carbohydrates);
            formData.append('fat', fat);
            if (photo) {
                formData.append('photo', photo);
            }

            createIngredient(formData)

            handleClose();
        } catch (error) {
            console.error('Failed to create recipe or ingredients', error);
        }
    };


    const calories = calculateCalories()

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create Ingredient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="ingredientName">
                        <Form.Label>Ingredient Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={ingredientName}
                            onChange={handleIngredientNameChange}
                            placeholder='Enter ingredient name'
                        />
                    </Form.Group>
                    <div {...getRootProps({ className: 'dropzone' })} className="my-3 p-3 border border-dashed text-center">
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag 'n' drop a photo here, or click to select one</p>
                        }
                    </div>
                    {photo && <p>Selected photo: {photo.name}</p>}
                    <Form.Group controlId="protein">
                        <Form.Label>Protein</Form.Label>
                        <Form.Control
                            type="number"
                            value={protein}
                            onChange={handleProteinChange}
                            placeholder='Protein value'
                        />
                    </Form.Group>
                    <Form.Group controlId="carbohydrates">
                        <Form.Label>Carbohydrates</Form.Label>
                        <Form.Control
                            type="number"
                            value={carbohydrates}
                            onChange={handleCarbohydratesChange}
                            placeholder='Carbohydrates value'
                        />
                    </Form.Group>
                    <Form.Group controlId="fat">
                        <Form.Label>Fat</Form.Label>
                        <Form.Control
                            type="number"
                            value={fat}
                            onChange={handleFatChange}
                            placeholder='Fat value'
                        />
                    </Form.Group>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IngredientCreate;
