import React, {useState, useEffect} from "react";
import { fetchRecipe } from "../services/api";




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
      <>
      <div>
        <h1>{recipe.name}</h1>
        <p>{recipe.description}</p>
      </div>
      <div>
          
      </div>
      </>
    )}

}

export default RecipeDetail