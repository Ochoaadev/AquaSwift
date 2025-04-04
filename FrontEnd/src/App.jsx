import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./service/PageTransition";
import ProtectedRoute from "./contexts/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import UpProvider from "./contexts/UpProvider";

//Free
import LandingPage from "./views/LandingPage";
import AboutUs from "./views/AboutUs";
import Register from "./views/Register";
import Login from "./views/Login";

//Usuario
import UserHome from "./views/User/UserHome";
import MisCompetencias from "./views/User/MisCompetencias";
import Perfil from "./views/User/Perfil";
import ResultCompet from './views/User/ResultCompet'

//Admin
import AdminHome from "./views/Admin/AdminHome";
import Acuatlon from "./views/Admin/Acuatlon";
import Natacion from "./views/Admin/Natacion";
import Triatlon from "./views/Admin/Triatlon";
import AdminUsuarios from "./views/Admin/AdminUsuarios";
import Resultados from "./views/Admin/Resultados";

function App() {
  return (
    <UpProvider>
      <AuthProvider>
        <Router>
          <Header />
          <AnimatedRoutes />
          <Footer />
          <Toaster position='top-right' />
        </Router>
      </AuthProvider>
    </UpProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route
          path='/'
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path='/AboutUs'
          element={
            <PageTransition>
              <AboutUs />
            </PageTransition>
          }
        />
        <Route
          path='/register'
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path='/login'
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />

        {/* Rutas protegidas User */}
        <Route
          path='/userHome'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <UserHome />
                </PageTransition>
              }
              allowedRoles={["Usuario"]}
            />
          }
        />
        <Route
          path='/misCompetencias'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <MisCompetencias />
                </PageTransition>
              }
              allowedRoles={["Usuario"]}
            />
          }
        />
        <Route
          path='/perfil'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <Perfil />
                </PageTransition>
              }
              allowedRoles={["Usuario"]}
            />
          }
        />
                <Route
          path='/resultado'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <ResultCompet />
                </PageTransition>
              }
              allowedRoles={["Usuario"]}
            />
          }
        />

        {/* Rutas protegidas Admin */}
        <Route
          path='/adminHome'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <AdminHome />
                </PageTransition>
              }
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path='/natacion'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <Natacion />
                </PageTransition>
              }
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path='/triatlon'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <Triatlon />
                </PageTransition>
              }
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path='/acuatlon'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <Acuatlon />
                </PageTransition>
              }
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path='/resultados'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <Resultados />
                </PageTransition>
              }
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path='/usuarios'
          element={
            <ProtectedRoute
              element={
                <PageTransition>
                  <AdminUsuarios />
                </PageTransition>
              }
              allowedRoles={["Admin"]}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
