import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./views/LandingPage";
import AboutUs from "./views/AboutUs";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas publicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />

        {/* Rutas protegidas */}

      </Routes>
    </Router>
  )
}

export default App
