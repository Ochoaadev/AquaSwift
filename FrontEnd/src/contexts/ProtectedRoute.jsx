import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const role = localStorage.getItem("role"); // Obtiene el rol almacenado en localStorage

    if (!role) {
        // Si no está autenticado, redirigir al login
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
        // Si el usuario no tiene permiso para esta ruta, redirigir a su home
        return role === "Admin" ? <Navigate to="/adminHome" /> : <Navigate to="/userHome" />;
    }

    return element;
};

export default ProtectedRoute;
