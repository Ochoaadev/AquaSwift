import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import LandingPage from "./views/LandingPage";
import AboutUs from "./views/AboutUs";
import Register from "./views/Register";
import Login from "./views/Login";
import UserHome from "./views/User/UserHome";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas publicas */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/AboutUs' element={<AboutUs />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          {/* Rutas protegidas User*/}
          <Route
            path='/userHome'
            element={
              <PrivateRoute>
                <UserHome />
              </PrivateRoute>
            }
          />

          {/* Rutas protegidas Admin*/}
          {/* Para las rutas de administrador usar la misma estructura que las protedigas de usuario, solo que al componente 'PrivateRoute' se le debe pasar la propiedad 'adminOnly' en true */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
