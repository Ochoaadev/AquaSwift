import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./service/PageTransition";

import Header from "./components/Header";
import Footer from "./components/Footer";
import UpProvider from './contexts/UpProvider'

//Free
import LandingPage from "./views/LandingPage";
import AboutUs from "./views/AboutUs";
import Register from "./views/Register";
import Login from "./views/Login";

//Usuario
import UserHome from "./views/User/UserHome";
import MisCompetencias from "./views/User/MisCompetencias";
import Perfil from "./views/User/Perfil";

//Admin
import AdminHome from "./views/Admin/AdminHome";
import Acuatlon from "./views/Admin/Acuatlon";
import Natacion from "./views/Admin/Natacion";
import Triatlon from "./views/Admin/Triatlon";
import AdminUsuarios from "./views/Admin/AdminUsuarios";
// import Resultados from "./views/Admin/Resultados";
import Competencia from './views/Admin/Competencia'


function App() {
  return (
  <UpProvider>
    <AuthProvider>
      <Router>
        <Header />
        <AnimatedRoutes />
        <Footer />
      </Router>
    </AuthProvider>
  </UpProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path='/' element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path='/AboutUs' element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path='/register' element={<PageTransition><Register /></PageTransition>} />
        <Route path='/login' element={<PageTransition><Login /></PageTransition>} />

        {/* Rutas protegidas User */}
        <Route path='/userHome' element={<PageTransition><UserHome /></PageTransition>} />
        <Route path='/misCompetencias' element={<PageTransition><MisCompetencias /></PageTransition>} />
        <Route path='/perfil' element={<PageTransition><Perfil /></PageTransition>} />

        {/* Rutas protegidas Admin */}
        <Route path='/adminHome' element={<PageTransition><AdminHome /></PageTransition>} />
        <Route path='/natacion' element={<PageTransition><Natacion /></PageTransition>} />
        <Route path='/triatlon' element={<PageTransition><Triatlon /></PageTransition>} />
        <Route path='/acuatlon' element={<PageTransition><Acuatlon /></PageTransition>} />
        <Route path='/usuarios' element={<PageTransition><AdminUsuarios /></PageTransition>} />
        {/* <Route path='/resultados' element={<PageTransition><Resultados /></PageTransition>} /> */}
        <Route path='/competencia' element={<PageTransition><Competencia /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
