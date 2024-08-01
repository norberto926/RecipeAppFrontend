import {useState, useEffect} from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import IngredientEdit from "./IngredientEdit";
import IngredientCreate from "./IngredientCreate";
import { fetchIngredients, deleteIngredient } from "../services/api";




const IngredientList = () => {

    const [showEdit, setShowEdit] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [ingredients, setIngredients] = useState([])
    const [ingredientId, setIngredientId] = useState(null)


    const handleClose = () => {
        setShowEdit(false)
        setShowCreate(false)
    }
    const handleViewIngredient = (action, id = null) => {
        setIngredientId(id)
        if (action == "edit"){
            setShowEdit(true)
        }
        if (action == "create"){
            setShowCreate(true)
        }
    }

    const handleDeleteIngredient= (id = null) => {
        deleteIngredient(id)
        setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id))
        
    }

    useEffect(() => {
        fetchIngredients()
            .then(data => {
                setIngredients(data)
            })
    .catch(error => {
        console.error('There was an error fetching the ingredients!', error);
    })
}, [showEdit, showCreate])


return (
    <Container>
    <h1>Ingredients</h1>
    <Button onClick={() => handleViewIngredient("create")}>Add New Ingredient</Button>
                            <Row>
                            <Col xs={4}>
                                <p>Name</p>
                            </Col>
                            <Col xs={2}>
                                <p>Protein</p>
                            </Col>
                            <Col xs={2}>
                                <p>Carbohydrates</p>
                            </Col>
                            <Col xs={2}>
                                <p>Fat</p>
                            </Col>
                            <Col xs={2}>
                                <p>Calories</p>
                            </Col>
                        </Row>
    {ingredients.map((ingredient) => {return(

                        <Row key={ingredient.id} className="align-items-center mb-4">
                            <Col xs={4}>
                                <p>{ingredient.name}</p>
                                <Button variant="primary" size="sm"  className="me-2" onClick={() => handleViewIngredient("edit", ingredient.id)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteIngredient(ingredient.id)} >Delete</Button>
                            </Col>
                            <Col xs={2}>
                                <p>{ingredient.protein} g</p>
                            </Col>
                            <Col xs={2}>
                                <p>{ingredient.carbohydrates} g</p>
                            </Col>
                            <Col xs={2}>
                                <p>{ingredient.fat} g</p>
                            </Col>
                            <Col xs={2}>
                                <p>{ingredient.calories} kcal</p>
                            </Col>
                        </Row>
                    )})}

    {showEdit && <IngredientEdit show={showEdit} handleClose={handleClose} ingredientId={ingredientId} />}
    {showCreate && <IngredientCreate show={showCreate} handleClose={handleClose} />}
</Container>
)}

export default IngredientList