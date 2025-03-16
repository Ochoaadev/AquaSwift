import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { ModalCustom } from "../components/ModalCustom";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    loginInput: "", 
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState({ isOpen: false, content: {} });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.loginInput) errors.loginInput = true;
    if (!formData.password) errors.password = true;

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowModal({
        isOpen: true,
        content: {
          title: "Error de Formulario",
          message: "Por favor, ingrese su email o username y contraseña.",
          type: "form",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const isEmail = formData.loginInput.includes("@"); 
      const loginData = isEmail
        ? { Email: formData.loginInput } // Si es un email, enviar Email
        : { Username: formData.loginInput }; // Si no, enviar Username

      const response = await signIn({
        ...loginData, // Envía Email o Username
        Contrasena: formData.password, // Envía la contraseña
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        const userRole = response.data.Rol;

        if (userRole === "Admin") {
          navigate("/adminHome");
        } else {
          navigate("/userHome");
        }
      } else {
        setShowModal({
          isOpen: true,
          content: {
            title: "Error de Inicio de Sesión",
            message: response.data.message || "Credenciales incorrectas",
            type: "error"
          }
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setShowModal({
        isOpen: true,
        content: {
          title: "Error de Red",
          message: "Hubo un problema con la conexión al servidor",
          type: "error"
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="px-2 w-11/12 mx-auto mt-5">
        <div className="mx-auto mt-8 w-full max-w-lg p-8 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#9333EA]">
          <h1 className="text-3xl font-bold text-center text-white mb-2 animate-fade-in">
            Bienvenido
          </h1>
          <p className="text-center text-white mb-6 animate-fade-in">
            Ingresa en tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de Email o Username */}
            <div>
              <input
                type="text"
                name="loginInput"
                value={formData.loginInput}
                onChange={handleChange}
                placeholder={errors.loginInput ? "Email o Username *" : "Email o Username"}
                style={{ background: "transparent" }}
                className={`w-full py-3 bg-transparent border-b ${
                  errors.loginInput ? "font-bold" : "font-medium"
                } text-[#fff] ${
                  errors.loginInput
                    ? "placeholder-[#FF0000]"
                    : "placeholder-[#CBD5E1]"
                } focus:outline-none focus:scale-105 transition-all duration-300`}
              />
            </div>

            {/* Campo de Contraseña */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={errors.password ? "Contraseña *" : "Contraseña"}
                style={{ background: "transparent" }}
                className={`w-full py-3 bg-transparent border-b ${
                  errors.password ? "font-bold" : "font-medium"
                } text-[#fff] ${
                  errors.password
                    ? "placeholder-[#FF0000]"
                    : "placeholder-[#CBD5E1]"
                } focus:outline-none focus:scale-105 transition-all duration-300`}
              />
            </div>

            {/* Mensaje de error general */}
            {Object.keys(errors).length > 0 && (
              <div className="text-[#FF0000] text-md text-center font-bold mb-4 animate-fade-in">
                Todos los campos son requeridos
              </div>
            )}

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#A855F7] text-white rounded-[5px] hover:bg-[#A855F7]/70 transition-colors duration-300 disabled:opacity-70"
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Enlace a Registro */}
          <div className="mt-6 flex justify-between">
            <span className="text-white">No tienes una cuenta?</span>
            <Link
              to="/register"
              className="text-[#D8B4FE] hover:underline hover:text-[#D8B4FE]/70 transition-colors duration-300"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
      {showModal.isOpen && (
        <ModalCustom
          {...showModal.content}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Login;