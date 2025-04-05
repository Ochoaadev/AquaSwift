import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [resetPasswordModal, setResetPasswordModal] = useState({
    open: false,
    email: "",
    token: "",
    step: 1, // 1: ingresar token, 2: nueva contraseña
    newPassword: "",
    confirmPassword: "",
  });
  let logoutTimer;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("_id");

    if (!token || !userId) return;
  }, []);
  
const signUp = async (userData) => {
    try {
      const response = await fetch("http://localhost:4000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { status: response.status, data };
      } else {
        return { status: response.status, data };
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      return { status: 500, data: { message: "Error de servidor" } };
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        return { status: response.status, data };
      }

      const { token, Rol, _id } = data;

      setUser({ _id, role: Rol });

      localStorage.setItem("token", token);
      localStorage.setItem("role", Rol);
      localStorage.setItem("_id", _id);

      return { status: 200, data };
    } catch (error) {
      console.error("Error en signIn:", error);
      return { status: 500, data: { message: "Error de servidor" } };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("_id");
        clearTimeout(logoutTimer);
        console.log("Sesión cerrada correctamente.");
      } else {
        console.error("Error al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
    }
  };

  // Función para solicitar recuperación de contraseña
  const solicitarRecuperacion = async (email) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/solicitar-recuperacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.mensaje);
        setResetPasswordModal({
          open: true,
          email: email,
          token: "",
          step: 1,
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.mensaje || "Error al solicitar recuperación");
      }
    } catch (error) {
      toast.error("Error al enviar el correo de recuperación");
      console.error("Error al enviar el correo:", error);
    }
  };

  // Función para reenviar el token
  const reenviarToken = async () => {
    return await solicitarRecuperacion(resetPasswordModal.email);
  };

  // Función para verificar el token
  const verificarToken = async () => {
    try {
      // Aquí podrías hacer una verificación preliminar si lo deseas
      // Por ahora solo avanzamos al paso 2
      setResetPasswordModal(prev => ({
        ...prev,
        step: 2,
      }));
    } catch (error) {
      toast.error("Error al verificar el token");
      console.error("Error al verificar token:", error);
    }
  };

  // Función para cambiar la contraseña
  const cambiarContrasena = async () => {
    const { token, newPassword, email } = resetPasswordModal;

    if (newPassword !== resetPasswordModal.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevaContrasena: newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.mensaje);
        setResetPasswordModal({
          open: false,
          email: "",
          token: "",
          step: 1,
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.mensaje || "Error al cambiar la contraseña");
      }
    } catch (error) {
      toast.error("Error al cambiar la contraseña");
      console.error("Error al cambiar contraseña:", error);
    }
  };

  // Función para cerrar el modal
  const cerrarModalRecuperacion = () => {
    setResetPasswordModal({
      open: false,
      email: "",
      token: "",
      step: 1,
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        logout,
        solicitarRecuperacion,
        resetPasswordModal,
        setResetPasswordModal,
        reenviarToken,
        verificarToken,
        cambiarContrasena,
        cerrarModalRecuperacion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};