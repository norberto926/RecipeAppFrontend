import { useState, useEffect, useCallback} from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { fetchIngredients, updateRecipe, deleteRecipeIngredient, createRecipeIngredient, fetchRecipe, updateRecipeIngredient} from '../services/api';
import { useDropzone } from 'react-dropzone';

const RecipeEdit = ({ show, handleClose, recipeId}) => {
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [RecipeIngredients, setRecipeIngredients] = useState([]);
    const [newRecipeIngredientIngredient, setNewRecipeIngredientIngredient] = useState("")
    const [newRecipeIngredientQuantity, setNewRecipeIngredientQuantity] = useState("")
    const [deletedRecipeIngredients, setDeletedRecipeIngredients] = useState([])
    const [updatedRecipeIngredients, setUpdatedRecipeIngredients] = useState([]);
    const [newRecipeIngredients, setNewRecipeIngredients] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(null)

    useEffect(() => {
        fetchRecipe(recipeId)
            .then(data => {
                setRecipe(data);
                setRecipeIngredients(data.recipe_ingredients || []);
                setRecipeName(data.name)
                setRecipeDescription(data.description)
                setCurrentPhoto(data.photo)
            })
            .catch(error => {
                console.error('There was an error fetching the recipe!', error);
            });
    }, [recipeId]);

    

    useEffect(() => {
        fetchIngredients().then(data => {
            setIngredients(data);
        });
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        setRecipeIngredients(prevRecipeIngredients => 
            prevRecipeIngredients.map(recipeIngredient => 
                recipeIngredient.id === id ? { ...recipeIngredient, quantity: newQuantity } : recipeIngredient
            )
        );
    
        setUpdatedRecipeIngredients(prevUpdatedRecipeIngredients => {
            // Check if the id exists in newRecipeIngredients
            const isInNewRecipeIngredients = newRecipeIngredients.some(recipeIngredient => recipeIngredient.id === id);
    
            if (!isInNewRecipeIngredients) {
                // Check if the ingredient is already in updatedRecipeIngredients
                const isInUpdatedRecipeIngredients = prevUpdatedRecipeIngredients.some(recipeIngredient => recipeIngredient.id === id);
                
                if (isInUpdatedRecipeIngredients) {
                    // Update the quantity if it is already in updatedRecipeIngredients
                    return prevUpdatedRecipeIngredients.map(recipeIngredient => 
                        recipeIngredient.id === id ? { ...recipeIngredient, quantity: newQuantity } : recipeIngredient
                    );
                } else {
                    // Add the ingredient to updatedRecipeIngredients if it's not already there
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
    };
    const handleNewIngredientQuantityChange = (e) => {
        setNewRecipeIngredientQuantity(e.target.value);
    };
    
    const handleAddRecipeIngredient = () => {
        if ( newRecipeIngredientIngredient && newRecipeIngredientQuantity ) {
            setRecipeIngredients(prevRecipeIngredients => [
                ...prevRecipeIngredients, 
                { recipe: recipeId, ingredient: parseInt(newRecipeIngredientIngredient), quantity: parseInt(newRecipeIngredientQuantity), id: Date.now() }
            ]);
            setNewRecipeIngredients([...newRecipeIngredients, { recipe: recipeId, ingredient: parseInt(newRecipeIngredientIngredient), quantity: parseInt(newRecipeIngredientQuantity), id: Date.now()}]);
            setNewRecipeIngredientIngredient("");
            setNewRecipeIngredientQuantity("")
        }
    };

    const handleRecipeNameChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleRecipeDescriptionChange = (e) => {
        setRecipeDescription(e.target.value);
    };

    const onDrop = useCallback((acceptedFiles) => {
        setPhoto(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const calculateSummary = () => {
        const summary = RecipeIngredients.reduce((acc, recipeIngredient) => {
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

    const summary = calculateSummary();
    const handleSave = async () => {
        
        console.log("Recipe ingredients:", RecipeIngredients)
        console.log("Updated recipe ingredients:", updatedRecipeIngredients)

        const formData = new FormData();
        formData.append('name', recipeName);
        formData.append('description', recipeDescription);
        if (photo) {
            formData.append('photo', photo);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }

        try {
        updateRecipe(recipeId,formData)
    } catch (error) {
        console.error('Failed to update recipe', error)
    }
        
        // Update existing ingredients
        updatedRecipeIngredients.forEach(recipeIngredient => {
          const updatedIngredient = {
            id: recipeIngredient.id,
            recipe: recipeId,
            ingredient: recipeIngredient.ingredient,
            quantity: recipeIngredient.quantity
          };
          updateRecipeIngredient(updatedIngredient.id, updatedIngredient)
        });
    
        // Delete ingredients
        deletedRecipeIngredients.forEach(id => {
          deleteRecipeIngredient(id)
        });

    
        // Create new ingredients
        newRecipeIngredients.forEach(ingredient => {
          const newIngredientData = {
            recipe: recipeId,
            ingredient: ingredient.ingredient,
            quantity: ingredient.quantity
          };
          createRecipeIngredient(newIngredientData)
        });
    
        handleClose();

      };

      if (recipe){

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
                    placeholder='Enter recipe title'
                />
                </Form.Group>
                <Form.Group controlId="recipeDescription">
                <Form.Label>Recipe Description</Form.Label>
                <Form.Control
                    type="text"
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
                    <Image src={currentPhoto} fluid/>
                    {RecipeIngredients.map((recipeIngredient, index) => {
                        const ingredientDetails = getIngredientDetails(recipeIngredient.ingredient);
                        return(
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
                    )})}

                    <h5>Recipe Summary</h5>
                    <p>Protein: {summary.protein}g</p>
                    <p>Carbohydrates: {summary.carbohydrates}g</p>
                    <p>Fat: {summary.fat}g</p>
                    <p>Calories: {summary.calories}kcal</p>
                </Form>
                <Form>
                    <h5>Add new ingredient</h5>
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
    );} else {
        return <div>Loading...</div>
    }
};

export default RecipeEdit;