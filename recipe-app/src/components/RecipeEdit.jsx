import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchIngredients, updateRecipe } from '../services/api';

const RecipeEdit = ({show, handleClose, recipe, onSave}) => {
    const [ingredients, setIngredients] = useState(recipe.recipe_ingredients || [])
    const [allIngredients, setAllIngredients] = useState([])
    const [newIngredient, setNewIngredient] = useState([{id: '', quantity: ''}])
    
    useEffect(() => {
        fetchIngredients().then(data => setAllIngredients(data))
    })

    const handleQuantityChange = (id, newQuantity) => {
        setIngredients(prevIngredients => prevIngredients.map(ingredient => ingredient.id === id ? {...ingredient, quantity: newQuantity } : ingredient))
    }

    const handleDelete = (id) => {
        setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id))
    }

    const handleNewIngredientChange = (index, e) => {

        const {name, value} = e.target

        setNewIngredient(prevState => ({...prevState, [name]: value}))


    }

    const handleAddIngredient = () => {
        const ingredient = allIngredients.find(ing => ing.id === newIngredient.id)
        if (ingredient && newIngredient.quantity) {
            setIngredients([...ingredients, {ingredient, quantity: parseFloat(newIngredient.quantity)}])
        }

    }

    const calculateSummary = () => {
        const summary = ingredients.reduce((acc, recipeIngredient) => {
            acc.protein += (recipeIngredient.ingredient.protein * recipeIngredient.quantity) / 100
            acc.carbohydrates += (recipeIngredient.ingredient.carbohydrates * recipeIngredient.quantity) / 100
            acc.fat += (recipeIngredient.ingredient.fat * recipeIngredient.quantity) / 100;
            acc.calories += ((recipeIngredient.ingredient.protein * 4 + recipeIngredient.ingredient.carbohydrates * 4 + recipeIngredient.ingredient.fat * 9) * recipeIngredient.quantity) / 100;
            return acc
        }, {protein: 0, carbohydrates : 0, fat: 0, calories: 0}
        )
        return summary
    }

    const summary = calculateSummary()

    const handleSave = () => {
        const updatedRecipe = {
            ...recipe, 
            recipe_ingredients: ingredients.map(recipeIngredient => ({
                id: recipeIngredient.id,
                ingredient: recipeIngredient.ingredient.id,
                quantity: recipeIngredient.quantity,


            })),
        }
        updateRecipe(updatedRecipe.id, updatedRecipe)
            .then(onSave)
            .catch(error => console.error('There was an error updating the recipe:', error))
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Recipe</Modal.Title>
            </Modal.Header>  
            <Modal.Body>
                <Form>
                    {ingredients.map((recipeIngredient, index) => (
                        <Row key={index} className="align-items-center mb-2">
                            <Col xs={6}>
                                <Form.Control plaintext readOnly defaultValue={recipeIngredient.ingredient.name}/>
                            </Col>
                            <Col xs={3}>
                                <Form.Control type="number" value={recipeIngredient.quantity} onChange={(e) => handleQuantityChange(recipeIngredient.id, parseFloat(e.target.value))}/>

                            </Col>
                            <Col xs={3}> 
                                <Button variant="danger" onClick={() => handleDelete(recipeIngredient.id)}>Delete</Button>
                            </Col>
                        </Row>
                    ))}

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
                            <Form.Control as="select" name="id" value={newIngredient.id} onChange={handleNewIngredientChange}>
                                <option value="">Select Ingredient</option>
                                {allIngredients.map(ingredient => (
                                    <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col xs={3}>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={newIngredient.quantity}
                                onChange={handleNewIngredientChange}
                            />
                        </Col>
                        <Col xs={3}>
                            <Button variant="primary" onClick={handleAddIngredient}>Add</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    )


}

export default RecipeEdit;