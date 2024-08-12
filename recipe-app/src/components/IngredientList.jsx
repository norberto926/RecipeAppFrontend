import {useState, useEffect} from "react";
import { Button, Row, Col, Container, Form} from "react-bootstrap";
import IngredientEdit from "./IngredientEdit";
import IngredientCreate from "./IngredientCreate";
import { fetchIngredients, deleteIngredient } from "../services/api";




const IngredientList = () => {

    const [showEdit, setShowEdit] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [ingredients, setIngredients] = useState([])
    const [ingredientId, setIngredientId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");

    const handleClose = () => {
        setShowEdit(false)
        setShowCreate(false)
    }
    const handleViewIngredient = (action, id = null) => {
        setIngredientId(id)
        if (action === "edit"){
            setShowEdit(true)
        }
        if (action === "create"){
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

const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery)
);

const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
};

    return (
        <Container>
            <div className="header-container">
                <h1>Ingredients</h1>
                <Form>
                <Form.Control
                                type="text"
                                placeholder="Search for an ingredient"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                            />
                </Form>
                <Button className="btn btn-primary add-recipe-btn" onClick={() => handleViewIngredient("create")}>Add New Ingredient</Button>
            </div>
            <div className="table-container">
                <Row className="table-header">
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
                {filteredIngredients.map((ingredient) => {
                    return (
                        <Row key={ingredient.id} className="table-row align-items-center">
                            <Col xs={4}>
                                <p>{ingredient.name}</p>
                                <Button variant="primary" size="sm" onClick={() => handleViewIngredient("edit", ingredient.id)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteIngredient(ingredient.id)}>Delete</Button>
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
                    )
                })}
            </div>
            {showEdit && <IngredientEdit show={showEdit} handleClose={handleClose} ingredientId={ingredientId} />}
            {showCreate && <IngredientCreate show={showCreate} handleClose={handleClose} />}
        </Container>
    )
}

export default IngredientList;