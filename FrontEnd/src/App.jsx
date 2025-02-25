import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./views/LandingPage";
import AboutUs from "./views/AboutUs";
import Register from "./views/Register"
import Login from "./views/Login"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas publicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
      </Routes>
    </Router>
  )
}

export default App
