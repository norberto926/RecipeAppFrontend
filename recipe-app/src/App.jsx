import React from "react"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import RecipeList from "./components/RecipeList"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<RecipeList/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
