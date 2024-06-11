import React, {useState, useEffect} from "react";
import { fetchRecipe } from "../services/api";
import Card from 'react-bootstrap/Card';
import { ListGroup } from "react-bootstrap";





const RecipeDetail = ({id}) => {

    const [recipe, setRecipe] = useState(null)

    useEffect(() => {
        fetchRecipe(id)
            .then(data => {
                setRecipe(data)
            })
            .catch(error => {
                console.error('There was an error fetching the recipe!', error)
            })
    }, [id])

    if (!recipe) {
      return <div>Loading...</div>
    }
    else {

    return ( 
      <Card style={{ width: '40rem' }} key={recipe.id}>
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
      <ListGroup className="list-group-flush">
        {recipe.recipe_ingredients.map(ingredient => (
            <ListGroup.Item key={ingredient.id}>{ingredient.ingredient.name} {ingredient.quantity} g</ListGroup.Item>
        ))}
          
      </ListGroup>   
  </Card>
    )}

}

export default RecipeDetail