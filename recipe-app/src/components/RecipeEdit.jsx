import { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { updateRecipe, deleteRecipeIngredient, createRecipeIngredient, fetchRecipe, updateRecipeIngredient } from '../services/api';
import { useDropzone } from 'react-dropzone';

const RecipeEdit = ({ show, handleClose, recipeId, onSave, ingredients }) => {
    const [recipe, setRecipe] = useState(null);
    const [RecipeIngredients, setRecipeIngredients] = useState([]);
    const [newRecipeIngredientIngredient, setNewRecipeIngredientIngredient] = useState("");
    const [newRecipeIngredientQuantity, setNewRecipeIngredientQuantity] = useState("");
    const [deletedRecipeIngredients, setDeletedRecipeIngredients] = useState([]);
    const [updatedRecipeIngredients, setUpdatedRecipeIngredients] = useState([]);
    const [newRecipeIngredients, setNewRecipeIngredients] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [existingRecipeError, setExistingRecipeError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchRecipe(recipeId)
            .then(data => {
                setRecipe(data);
                setRecipeIngredients(data.recipe_ingredients || []);
                setRecipeName(data.name);
                setRecipeDescription(data.description);
                setCurrentPhoto(data.photo);
            })
            .catch(error => {
                console.error('There was an error fetching the recipe!', error);
            });
    }, [recipeId]);



    const handleQuantityChange = (id, newQuantity) => {
        setRecipeIngredients(prevRecipeIngredients =>
            prevRecipeIngredients.map(recipeIngredient =>
                recipeIngredient.id === id ? { ...recipeIngredient, quantity: newQuantity } : recipeIngredient
            )
        );

        setUpdatedRecipeIngredients(prevUpdatedRecipeIngredients => {
            const isInNewRecipeIngredients = newRecipeIngredients.some(recipeIngredient => recipeIngredient.id === id);

            if (!isInNewRecipeIngredients) {
                const isInUpdatedRecipeIngredients = prevUpdatedRecipeIngredients.some(recipeIngredient => recipeIngredient.id === id);

                if (isInUpdatedRecipeIngredients) {
                    return prevUpdatedRecipeIngredients.map(recipeIngredient =>
                        recipeIngredient.id === id ? { ...recipeIngredient, quantity: newQuantity } : recipeIngredient
                    );
                } else {
                    const updatedIngredient = RecipeIngredients.find(recipeIngredient => recipeIngredient.id === id);
                    return [...prevUpdatedRecipeIngredients, { ...updatedIngredient, quantity: newQuantity }];
                }
            } else {
                return prevUpdatedRecipeIngredients;
            }
        });
    };

    const handleDelete = (id) => {
        setRecipeIngredients(prevRecipeIngredients =>
            prevRecipeIngredients.filter(recipeIngredient => recipeIngredient.id !== id)
        );
        setDeletedRecipeIngredients(prevDeletedRecipeIngredients => [...prevDeletedRecipeIngredients, id]);
    };

    const handleNewIngredientIngredientChange = (e) => {
        setNewRecipeIngredientIngredient(e.target.value);
        setIsDropdownOpen(false);
    };
    const handleNewIngredientQuantityChange = (e) => {
        setNewRecipeIngredientQuantity(e.target.value);
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleAddRecipeIngredient = () => {
        if (newRecipeIngredientIngredient && newRecipeIngredientQuantity) {
            const ingredientExists = RecipeIngredients.some(recipeIngredient => recipeIngredient.ingredient === parseInt(newRecipeIngredientIngredient));

            if (ingredientExists) {
                setExistingRecipeError("Ingredient already exists in the recipe.");
                return;
            }

            setRecipeIngredients(prevRecipeIngredients => [
                ...prevRecipeIngredients,
                { recipe: recipeId, ingredient: parseInt(newRecipeIngredientIngredient), quantity: parseInt(newRecipeIngredientQuantity), id: Date.now() }
            ]);
            setNewRecipeIngredients([...newRecipeIngredients, { recipe: recipeId, ingredient: parseInt(newRecipeIngredientIngredient), quantity: parseInt(newRecipeIngredientQuantity), id: Date.now() }]);
            setNewRecipeIngredientIngredient("");
            setNewRecipeIngredientQuantity("");
            setExistingRecipeError("");
        }
    };

    const handleRecipeNameChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleRecipeDescriptionChange = (e) => {
        setRecipeDescription(e.target.value);
    };

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery)
    );


    const onDrop = useCallback((acceptedFiles) => {
        setPhoto(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const calculateSummary = () => {
        const summary = RecipeIngredients.reduce((acc, recipeIngredient) => {
            const ingredientDetails = getIngredientDetails(recipeIngredient.ingredient);
            if (ingredientDetails) {
                acc.protein += (ingredientDetails.protein * recipeIngredient.quantity) / 100;
                acc.carbohydrates += (ingredientDetails.carbohydrates * recipeIngredient.quantity) / 100;
                acc.fat += (ingredientDetails.fat * recipeIngredient.quantity) / 100;
                acc.calories += ((ingredientDetails.protein * 4 + ingredientDetails.carbohydrates * 4 + ingredientDetails.fat * 9) * recipeIngredient.quantity) / 100;
            }
            return acc;
        }, { protein: 0, carbohydrates: 0, fat: 0, calories: 0 });
        return summary;
    };

    const getIngredientDetails = (id) => {
        return ingredients.find(ingredient => ingredient.id === id);
    };



    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', recipeName);
        formData.append('description', recipeDescription);
        if (photo) {
            formData.append('photo', photo);
        }
    
        try {
            // Update the recipe
            await updateRecipe(recipeId, formData);
    
            // Handle ingredient updates, deletions, and additions
            const updatePromises = updatedRecipeIngredients.map(async (recipeIngredient) => {
                const updatedIngredient = {
                    id: recipeIngredient.id,
                    recipe: recipeId,
                    ingredient: recipeIngredient.ingredient,
                    quantity: recipeIngredient.quantity
                };
                return updateRecipeIngredient(updatedIngredient.id, updatedIngredient);
            });
    
            const deletePromises = deletedRecipeIngredients.map(async (id) => {
                return deleteRecipeIngredient(id);
            });
    
            const createPromises = newRecipeIngredients.map(async (ingredient) => {
                const newIngredientData = {
                    recipe: recipeId,
                    ingredient: ingredient.ingredient,
                    quantity: ingredient.quantity
                };
                return createRecipeIngredient(newIngredientData);
            });
    
            // Wait for all promises to resolve
            await Promise.all([...updatePromises, ...deletePromises, ...createPromises]);
    
            // Notify parent component and close modal
            onSave();
            handleClose();
        } catch (error) {
            console.error('Failed to update recipe', error);
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    

    const summary = calculateSummary();

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="recipeName">
                        <Form.Label>Recipe Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={recipeName}
                            onChange={handleRecipeNameChange}
                            placeholder="Enter recipe title"
                        />
                    </Form.Group>
                    <Form.Group controlId="recipeDescription">
                        <Form.Label>Recipe Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            cols={50}
                            value={recipeDescription}
                            onChange={handleRecipeDescriptionChange}
                            placeholder="Enter recipe description"
                        />
                    </Form.Group>
                    <div {...getRootProps({ className: 'dropzone' })} className="my-3 p-3 border border-dashed text-center">
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop a photo here, or click to select one</p>}
                    </div>
                    {photo && <p>Selected photo: {photo.name}</p>}
                    {currentPhoto && <Image src={currentPhoto} height="200" fluid />}
                    {RecipeIngredients.map((recipeIngredient, index) => {
                        const ingredientDetails = getIngredientDetails(recipeIngredient.ingredient);
                        return (
                            <Row key={index} className="align-items-center mb-2">
                                <Col xs={6}>
                                    <Form.Control plaintext readOnly defaultValue={ingredientDetails ? ingredientDetails.name : "Loading..."} />
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
                                type="text"
                                placeholder="Search for an ingredient"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                            />
                        </Col>
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
                                {filteredIngredients.map(ingredient => (
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

export default RecipeEdit;