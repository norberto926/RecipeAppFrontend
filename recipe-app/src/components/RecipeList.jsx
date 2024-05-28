import React, {useState, useEffect} from "react";
import { fetchRecipes } from "../services/api";

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
        <ul>
            {recipes.map(recipe => (
                <li key={recipe.id}>{recipe.name}</li>
            ))}
        </ul>
    </div>
)}

export default RecipeList
