import React, {useState, useEffect} from "react";
import { fetchRecipes } from "../services/api";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';


const RecipeList = () => {

    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        fetchRecipes()
            .then(data => {
                setRecipes(data)
            })
    .catch(error => {
        console.error('There was an error fetching the recipes!', error);
    })
}, [])

return (
    <div>
        <h1>Recipes</h1>
        <Button>Add New Recipe</Button>
        <div>
            {recipes.map(recipe => (
                <Card style={{ width: '18rem' }} key={recipe.id}>
                    <Card.Body>
                        <Card.Title>{recipe.name}</Card.Title>
                        <Card.Subtitle>{recipe.category}</Card.Subtitle>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>Calories: {recipe.total_calories}</ListGroup.Item>
                        <ListGroup.Item>Protein: {recipe.total_protein}</ListGroup.Item>
                        <ListGroup.Item>Carbohydrates: {recipe.total_carbohydrates}</ListGroup.Item>
                        <ListGroup.Item>Fat: {recipe.total_fat}</ListGroup.Item>
                    </ListGroup>  
                    <Card.Body>
                        <Button variant="primary">Details</Button>
                        <Button variant="primary">Edit</Button>
                        <Button variant="primary">Delete</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    </div>
)}

export default RecipeList
