import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import RecipeList from "./components/RecipeList"
import IngredientList from "./components/IngredientList";
import AppNavbar from './components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 

function App() {

  return (
    <>
      <Router>
        <AppNavbar/>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/recipes"/>}/>
            <Route path="/recipes" element={<RecipeList/>}/>
            <Route path="/ingredients" element={<IngredientList/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
