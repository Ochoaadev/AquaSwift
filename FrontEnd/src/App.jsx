import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import LandingPage from "./views/LandingPage";
import AboutUs from "./views/AboutUs";
import Register from "./views/Register";
import Login from "./views/Login";
import UserHome from "./views/User/UserHome";
import AdminHome from "./views/Admin/AdminHome";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Rutas publicas */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/AboutUs' element={<AboutUs />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          {/* Rutas protegidas User*/}
          <Route path='/userHome' element={<UserHome />} />

           {/* Rutas protegidas Admin*/}
           <Route path='/adminHome' element={<AdminHome />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App
