import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "/logo.png";

const Header = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Función para alternar el menú en pantallas pequeñas
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Aquí se agrega la lógica para cerrar sesión (limpiar tokens, etc.)
    navigate("/"); // Redirigir a la ruta "/"
  };

  // Rutas según el rol del usuario
  const routes = {
    free: [
      { name: "Home", path: "/" },
      { name: "Login", path: "/login" },
      { name: "Registro", path: "/register" },
      { name: "About Us", path: "/AboutUs" },
    ],
    user: [
      { name: "Home", path: "/" },
      { name: "Mis Competencias", path: "/mis-competencias" },
      { name: "Perfil", path: "/perfil" },
    ],
    admin: [
      { name: "Home", path: "/" },
      { name: "Natación", path: "/natacion" },
      { name: "Triatlón", path: "/triatlon" },
      { name: "Acuatlón", path: "/acuatlon" },
      { name: "Usuarios", path: "/usuarios" },
      { name: "Resultados", path: "/resultados" },
    ],
  };

  // Obtener las rutas según el rol
  const userRoutes = routes[userRole] || routes.free;

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
          {userRoutes.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className="text-white poppins text-2xl font-medium hover:text-primary-400 transition-colors duration-200 relative group"
            >
              {route.name}
              <span className="absolute rounded-xl  -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-primary-100 to-primary-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          {/* Mostrar "Cerrar Sesión" solo para user y admin */}
          {(userRole === "user" || userRole === "admin") && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-primary-100 transition-colors duration-200 relative group"
            >
              Cerrar Sesión
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary-100 transition-all duration-300 group-hover:w-full"></span>
            </button>
          )}
        </div>

        {/* Botón de menú para pantallas pequeñas (sm) */}
        <button
          onClick={toggleMenu}
          className={`lg:hidden text-white focus:outline-none transform transition-transform duration-200 ${
            isMenuOpen ? "rotate-90" : "rotate-0"
          }`}
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
          {userRoutes.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className="block poppins text-xl font-medium text-white pl-4 py-2 rounded-xl hover:bg-primary-450 transition-colors duration-200 hover:pl-6 hover:py-4 "
            >
              {route.name}
            </Link>
          ))}
          {/* Mostrar "Cerrar Sesión" solo para user y admin */}
          {(userRole === "user" || userRole === "admin") && (
            <button
              onClick={handleLogout}
              className="block text-white py-2 hover:bg-primary-400 transition-colors duration-200 w-full text-left pl-4 hover:pl-6"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;