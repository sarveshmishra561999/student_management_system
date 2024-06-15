import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import Crud from "./pages/CRUD"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Crud />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
