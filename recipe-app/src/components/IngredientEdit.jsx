import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Row, Col, Image} from 'react-bootstrap';
import { fetchIngredient, updateIngredient } from '../services/api';
import { useDropzone } from 'react-dropzone';

const IngredientEdit = ({ show, handleClose, ingredientId }) => {
    const [ingredient, setIngredient] = useState(null)
    const [ingredientName, setIngredientName] = useState("");
    const [photo, setPhoto] = useState("");
    const [protein, setProtein] = useState("")
    const [carbohydrates, setCarbohydrates] = useState("")
    const [fat, setFat] = useState("")

    useEffect(() => {
        fetchIngredient(ingredientId)
            .then(data => {
                console.log('Fetched ingredient:', data);
                setIngredient(data);
                setIngredientName(data.name)
                setProtein(data.protein)
                setCarbohydrates(data.carbohydrates)
                setFat(data.fat)
                setPhoto(data.photo)
            })
            .catch(error => {
                console.error('There was an error fetching the ingredient!', error);
            });


    }, [ingredientId]);


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

            updateIngredient(ingredientId, formData)

            handleClose();
        } catch (error) {
            console.error('Failed to update ingredient', error);
        }
    };


    const calories = calculateCalories()

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Ingredient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="ingredientName">
                        <Form.Label>Ingredient Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={ingredientName}
                            onChange={handleIngredientNameChange}
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
                    <Image src={photo} fluid/>
                    <Form.Group controlId="protein">
                        <Form.Label>Protein</Form.Label>
                        <Form.Control
                            type="number"
                            value={protein}
                            onChange={handleProteinChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="carbohydrates">
                        <Form.Label>Carbohydrates</Form.Label>
                        <Form.Control
                            type="number"
                            value={carbohydrates}
                            onChange={handleCarbohydratesChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="fat">
                        <Form.Label>Fat</Form.Label>
                        <Form.Control
                            type="number"
                            value={fat}
                            onChange={handleFatChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="fat">
                        <Form.Label>Calories</Form.Label>
                        <Form.Control
                            readOnly
                            type="number"
                            value={calories}
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

export default IngredientEdit;