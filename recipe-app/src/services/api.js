const API_BASE_URL = 'http://localhost:8000/api'

export const fetchRecipes = async () => {
    const response = await fetch(`${API_BASE_URL}/recipes/`)

    if (!response.ok) {
        throw new Error('Recipes endpoint failed')
    }
    return response.json()
}

export const fetchRecipe = async (id) => {

    const response = await fetch(`${API_BASE_URL}/recipes/${id}/`)

    if (!response.ok) {
        throw new Error('Recipe details endpoint failed')
    }
    return response.json()

}

