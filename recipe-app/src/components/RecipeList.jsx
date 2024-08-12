import {useState, useEffect} from "react";
import { fetchRecipes, deleteRecipe, fetchIngredients } from "../services/api";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, Modal, Row, Col, Container } from "react-bootstrap";
import RecipeDetail from "./RecipeDetail";
import RecipeEdit from "./RecipeEdit";
import RecipeCreate from "./RecipeCreate";




const RecipeList = () => {

    const [showDetails, setShowDetails] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [recipes, setRecipes] = useState([])
    const [recipeId, setRecipeId] = useState(null)
    const [ingredients, setIngredients] = useState(null)


    const handleClose = () => {
        setShowDetails(false) 
        setShowEdit(false)
        setShowCreate(false)
    }
    const handleViewRecipe = (action, id = null) => {
        setRecipeId(id)
        if (action == "details") {
            setShowDetails(true)
        }
        if (action == "edit"){
            setShowEdit(true)
        }
        if (action == "create"){
            setShowCreate(true)
        }
    }

    const handleDeleteRecipe = (id = null) => {
        deleteRecipe(id)
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id))
        
    }

    const fetchAndUpdateRecipes = () => {
        fetchRecipes()
            .then(data => {
                setRecipes(data);
            })
            .catch(error => {
                console.error('There was an error fetching the recipes!', error);
            });
    };

    const fetchAndUpdateIngredients = () => {
        fetchIngredients()
            .then(data => {
                setIngredients(data);
            })
            .catch(error => {
                console.error('There was an error fetching the ingredients!', error);
            });
    };

    useEffect(() => {
        fetchAndUpdateRecipes();
        fetchAndUpdateIngredients();
    }, [showCreate]);


return (
    <Container>
    <div className="header-container">
        <h1 className="title">Recipes</h1>
        <Button className="btn btn-primary add-recipe-btn" onClick={() => handleViewRecipe("create")}>Add New Recipe</Button>
    </div>
    <Row>
        {recipes.map(recipe => (
            <Col md={4} key={recipe.id}>
                <Card style={{ marginBottom: '20px' }}>
                    <Card.Img variant="top" src={recipe.photo} height="270" alt={`${recipe.name} photo`} />
                    <Card.Body>
                        <Card.Title>{recipe.name}</Card.Title>
                        <Card.Subtitle>{recipe.category}</Card.Subtitle>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>Calories: {recipe.total_calories} kcal</ListGroup.Item>
                        <ListGroup.Item>Protein: {recipe.total_protein} g</ListGroup.Item>
                        <ListGroup.Item>Carbohydrates: {recipe.total_carbohydrates} g</ListGroup.Item>
                        <ListGroup.Item>Fat: {recipe.total_fat} g</ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <Button variant="primary" className="me-2" onClick={() => handleViewRecipe("details", recipe.id)}>Details</Button>
                        <Button variant="primary" className="me-2" onClick={() => handleViewRecipe("edit", recipe.id)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</Button>
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
    {showDetails && <RecipeDetail show={showDetails} handleClose={handleClose} recipeId={recipeId} onSave={fetchAndUpdateRecipes} ingredients={ingredients}/>}
    {showEdit && <RecipeEdit show={showEdit} handleClose={handleClose} recipeId={recipeId} onSave={fetchAndUpdateRecipes} ingredients={ingredients}/>}
    {showCreate && <RecipeCreate show={showCreate} handleClose={handleClose} ingredients={ingredients}/>}
</Container>
)}

export default RecipeList
