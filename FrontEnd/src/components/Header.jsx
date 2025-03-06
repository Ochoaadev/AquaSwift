import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation

import logo from '/logo.png';

const routes = {
  free: [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Registro", path: "/register" },
    { name: "About Us", path: "/AboutUs" },
  ],
  Usuario: [
    { name: "Home", path: "/userHome" },
    { name: "Mis Competencias", path: "/mis-competencias" },
    { name: "Perfil", path: "/perfil" },
    { name: "Logout", path: "/logout" },
  ],
  Admin: [
    { name: "Home", path: "/adminHome" },
    { name: "Natación", path: "/natacion" },
    { name: "Triatlón", path: "/triatlon" },
    { name: "Acuatlón", path: "/acuatlon" },
    { name: "Usuarios", path: "/usuarios" },
    { name: "Resultados", path: "/resultados" },
    { name: "Logout", path: "/logout" },
  ],
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const role = user ? user.role : 'free';
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ruta actual
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú

  const availableRoutes = routes[role] || routes['free'];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Función para alternar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para verificar si una ruta está activa
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"; // Solo activo si es exactamente "/"
    }
    return location.pathname.startsWith(path); // Para otras rutas
  };

  return (
    <nav className="bg-primary-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="lg:pl-6 md:pl-4 sm:-pl-2">
          <img
            src={logo}
            alt="Logo"
            className="transition hover:scale-105 duration-200 rounded-2xl w-24 hover:rotate-2 hover:shadow-lg"
          />
        </div>

        {/* Menú para pantallas grandes (lg y md) */}
        <div className="hidden lg:flex space-x-6">
          {availableRoutes.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className={`poppins text-2xl font-medium transition-colors duration-200 relative group ${
                isActive(route.path)
                  ? 'text-primary-400' // Estilo activo
                  : 'text-white hover:text-primary-400' // Estilo normal
              }`}
              onClick={route.name === 'Logout' ? handleLogout : undefined}
            >
              {route.name}
              <span
                className={`absolute rounded-xl -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-primary-100 to-primary-400 transition-all duration-300 group-hover:w-full ${
                  isActive(route.path) ? 'w-full' : '' // Subrayado activo
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Botón de menú para pantallas pequeñas (sm) */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white focus:outline-none transform transition-transform duration-200"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Menú desplegable para pantallas pequeñas (sm) */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-4">
          {availableRoutes.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className={`block poppins text-xl font-medium pl-4 py-2 rounded-xl transition-colors duration-200 hover:pl-6 hover:py-4 ${
                isActive(route.path)
                  ? 'text-primary-600 bg-primary-450' // Estilo activo
                  : 'text-white hover:bg-primary-450' // Estilo normal
              }`}
              onClick={() => {
                if (route.name === 'Logout') handleLogout();
                toggleMenu(); // Cierra el menú al hacer clic en un enlace
              }}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;