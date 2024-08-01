import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchIngredients, updateRecipe, deleteRecipeIngredient, createRecipeIngredient, fetchRecipe} from '../services/api';

const RecipeEdit = ({ show, handleClose, recipeId}) => {
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [RecipeIngredients, setRecipeIngredients] = useState([]);

    useEffect(() => {
        fetchRecipe(recipeId)
            .then(data => {
                console.log('Fetched recipe:', data);
                setRecipe(data);
                setRecipeIngredients(data.recipe_ingredients || []);
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



    const calculateSummary = () => {
        console.log(RecipeIngredients)
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


      if (recipe){

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Recipe Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={recipe.photo} width='100%'></img>
                <h1>{recipe.name}</h1>
                <p>{recipe.description}</p>
                <h3>Ingredients:</h3>
                    {RecipeIngredients.map((recipeIngredient, index) => {
                        const ingredientDetails = getIngredientDetails(recipeIngredient.ingredient);
                        return(
                        <Row key={index} className="align-items-center mb-2">
                            <Col xs={6}>
                                <p>{ingredientDetails.name}</p>
                            </Col>
                            <Col xs={3}>
                                <p>{recipeIngredient.quantity} g</p>
                            </Col>
                        </Row>
                    )})}

                    <h5>Recipe Summary</h5>
                    <p>Protein: {summary.protein}g</p>
                    <p>Carbohydrates: {summary.carbohydrates}g</p>
                    <p>Fat: {summary.fat}g</p>
                    <p>Calories: {summary.calories}kcal</p>
  
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );} else {
        return <div>Loading...</div>
    }
};

export default RecipeEdit;