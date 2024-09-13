const API_BASE_URL = 'https://recipeapp-a62p.onrender.com/api'

export const fetchRecipes = async () => {
    const response = await fetch(`${API_BASE_URL}/recipes/`)

    if (!response.ok) {
        throw new Error('Recipes endpoint failed')
    }
    return response.json()
}

export const deleteRecipe = async (recipeId) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  return data;
}

export const createRecipe = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/recipes/`,{
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create recipe');
  }
  return response.json();
}

export const fetchRecipe = async (id) => {

    const response = await fetch(`${API_BASE_URL}/recipes/${id}/`)

    if (!response.ok) {
        throw new Error('Recipe details endpoint failed')
    }
    return response.json()

}

export const updateRecipe = async (recipeId, formData) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
};

export const updateRecipeIngredient = async (recipeIngredientId, data) => {
    const response = await fetch(`${API_BASE_URL}/recipe-ingredients/${recipeIngredientId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return response.json();
  };
  
  export const deleteRecipeIngredient = async (recipeIngredientId) => {
    const response = await fetch(`${API_BASE_URL}/recipe-ingredients/${recipeIngredientId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete ingredient');
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return data;
  };

  export const deleteIngredient = async (ingredientId) => {
    const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete ingredient');
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return data;
  };
  
  export const createRecipeIngredient = async (data) => {
    const response = await fetch(`${API_BASE_URL}/recipe-ingredients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create ingredient');
    }
    return response.json();
  };

export const fetchIngredients = async () => {
    const response = await fetch(`${API_BASE_URL}/ingredients/`)

    if (!response.ok) {
        throw new Error('Ingredients endpoint failed')
    }
    return response.json()
}

export const createIngredient = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/ingredients/`,{
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create ingredient');
  }
  return response.json();
}

export const fetchIngredient = async (id) => {

  const response = await fetch(`${API_BASE_URL}/ingredients/${id}/`)

  if (!response.ok) {
      throw new Error('Ingredient details endpoint failed')
  }
  return response.json()

}

export const updateIngredient = async (ingredientId, formData) => {
  const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}/`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update ingredient');
  }
  return response.json();
};


export const createUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/user/register/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to register user');
  }
  return response.json();
};

export const loginUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/user/login/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to login user');
  }
  console.log(response.json())
  return response.json();

};




