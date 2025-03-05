import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthProvider"
import { useContext } from "react"

export default function PrivateRoute({ children, adminOnly = false }) {
  const {user} = useContext(AuthContext);
  const location = useLocation()


  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user.Rol !== "Admin") {
    return <Navigate to="/" replace />
  }

  return children
}

