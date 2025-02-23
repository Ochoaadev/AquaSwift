import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./views/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas publicas */}
        <Route path="/" element={<LandingPage />} />

        {/* Rutas protegidas */}

      </Routes>
    </Router>
  )
}

export default App
