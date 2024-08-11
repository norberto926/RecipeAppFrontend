import { useState, useCallback } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createRecipeIngredient, createRecipe } from '../services/api';
import { useDropzone } from 'react-dropzone';

const RecipeCreate = ({ show, handleClose, ingredients}) => {
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [newRecipeIngredientIngredient, setNewRecipeIngredientIngredient] = useState("");
    const [newRecipeIngredientQuantity, setNewRecipeIngredientQuantity] = useState("");
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [existingRecipeError, setExistingRecipeError] = useState("");


    const handleDelete = (id) => {
        setRecipeIngredients(prevRecipeIngredients => 
            prevRecipeIngredients.filter(recipeIngredient => recipeIngredient.id !== id)
        );
    };

    const handleNewIngredientIngredientChange = (e) => {
        setNewRecipeIngredientIngredient(e.target.value);
    };

    const handleNewIngredientQuantityChange = (e) => {
        setNewRecipeIngredientQuantity(e.target.value);
    };

    const handleRecipeNameChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleRecipeDescriptionChange = (e) => {
        setRecipeDescription(e.target.value);
    };

    const handleAddRecipeIngredient = () => {
        if (newRecipeIngredientIngredient && newRecipeIngredientQuantity) {

            const ingredientExists = recipeIngredients.some(recipeIngredient => recipeIngredient.ingredient === parseInt(newRecipeIngredientIngredient));
        
            if (ingredientExists) {
                setExistingRecipeError("Ingredient already exists in the recipe.");
                return;
            }
            setRecipeIngredients(prevRecipeIngredients => [
                ...prevRecipeIngredients, 
                { recipe: Date.now(), ingredient: parseInt(newRecipeIngredientIngredient), quantity: parseInt(newRecipeIngredientQuantity), id: Date.now() }
            ]);
            setNewRecipeIngredientIngredient("");
            setNewRecipeIngredientQuantity("");
        }
    };

    const calculateSummary = () => {
        const summary = recipeIngredients.reduce((acc, recipeIngredient) => {
            const ingredientDetails = getIngredientDetails(recipeIngredient.ingredient);
            acc.protein += (ingredientDetails.protein * recipeIngredient.quantity) / 100;
            acc.carbohydrates += (ingredientDetails.carbohydrates * recipeIngredient.quantity) / 100;
            acc.fat += (ingredientDetails.fat * recipeIngredient.quantity) / 100;
            acc.calories += ((ingredientDetails.protein * 4 + ingredientDetails.carbohydrates * 4 + ingredientDetails.fat * 9) * recipeIngredient.quantity) / 100;
            return acc;
        }, { protein: 0, carbohydrates: 0, fat: 0, calories: 0 });
        return summary;
    };

    const getIngredientDetails = (id) => {
        return ingredients.find(ingredient => ingredient.id === id);
    };

    const handleQuantityChange = (id, newQuantity) => {
        setRecipeIngredients(prevRecipeIngredients => 
            prevRecipeIngredients.map(recipeIngredient => 
                recipeIngredient.id === id ? { ...recipeIngredient, quantity: newQuantity } : recipeIngredient
            )
        );
    };

    const onDrop = useCallback((acceptedFiles) => {
        setPhoto(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleSave = async () => {
        try {
            // Create the recipe first
            const formData = new FormData();
            formData.append('name', recipeName);
            formData.append('description', recipeDescription);
            if (photo) {
                formData.append('photo', photo);
            }
    
            // Create the recipe and get the new recipe ID
            const newRecipe = await createRecipe(formData);
    
            const ingredientPromises = recipeIngredients.map(ingredient => {
                const newIngredientData = {
                    recipe: newRecipe.id,
                    ingredient: ingredient.ingredient,
                    quantity: ingredient.quantity
                };
                return createRecipeIngredient(newIngredientData);
            });
    
            // Wait for all ingredient creation promises to resolve
            await Promise.all(ingredientPromises);
    
            // Close the modal after all ingredients are saved
            handleClose();
        } catch (error) {
            console.error('Failed to create recipe or ingredients', error);
        }
    };

    const summary = calculateSummary();

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="recipeName">
                        <Form.Label>Recipe Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={recipeName}
                            onChange={handleRecipeNameChange}
                            placeholder='Enter recipe title'
                        />
                    </Form.Group>
                    <Form.Group controlId="recipeDescription">
                        <Form.Label>Recipe Description</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            rows={7}
                            cols={50}
                            value={recipeDescription}
                            onChange={handleRecipeDescriptionChange}
                            placeholder='Enter recipe description'
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
                    {recipeIngredients.map((recipeIngredient, index) => {
                        const ingredientDetails = getIngredientDetails(recipeIngredient.ingredient);
                        return (
                            <Row key={index} className="align-items-center mb-2">
                                <Col xs={6}>
                                    <Form.Control plaintext readOnly defaultValue={ingredientDetails.name} />
                                </Col>
                                <Col xs={3}>
                                    <Form.Control
                                        type="number"
                                        value={recipeIngredient.quantity}
                                        onChange={(e) => handleQuantityChange(recipeIngredient.id, parseFloat(e.target.value))}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Button variant="danger" onClick={() => handleDelete(recipeIngredient.id)}>Delete</Button>
                                </Col>
                            </Row>
                        );
                    })}
                    <h5>Recipe Summary</h5>
                    <p>Protein: {summary.protein}g</p>
                    <p>Carbohydrates: {summary.carbohydrates}g</p>
                    <p>Fat: {summary.fat}g</p>
                    <p>Calories: {summary.calories}kcal</p>
                </Form>
                <Form>
                    <h5>Add new ingredient</h5>
                    <Row>
                        <p className="text-danger">{existingRecipeError}</p>
                    </Row>
                    <Row className="align-items-center mb-2">
                        <Col xs={6}>
                            <Form.Control
                                as="select"
                                name="ingredient"
                                value={newRecipeIngredientIngredient}
                                onChange={handleNewIngredientIngredientChange}
                            >
                                <option value="">Select Ingredient</option>
                                {ingredients.map(ingredient => (
                                    <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col xs={3}>
                            <Form.Control
                                type="number"
                                value={newRecipeIngredientQuantity}
                                onChange={handleNewIngredientQuantityChange}
                            />
                        </Col>
                        <Col xs={3}>
                            <Button variant="primary" onClick={handleAddRecipeIngredient}>Add</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecipeCreate;
