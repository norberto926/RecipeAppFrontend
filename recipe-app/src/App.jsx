import React from "react"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import RecipeList from "./components/RecipeList"
import RecipeDetail from "./components/RecipeDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<RecipeList/>}/>
            <Route path="/recipes/:id" element={<RecipeDetail />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
