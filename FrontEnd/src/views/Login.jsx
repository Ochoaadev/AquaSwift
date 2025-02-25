import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!value) {
          newErrors.email = "El email es requerido";
        } else if (!validateEmail(value)) {
          newErrors.email = "Email inválido";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "La contraseña es requerida";
        } else if (value.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    if (Object.keys(errors).length === 0) {
      try {
        console.log("Datos enviados:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Login exitoso!");
      } catch (error) {
        console.error("Error al enviar:", error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex-grow flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md p-8 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#9333EA]'>
          <h1 className='text-3xl font-bold text-center text-white mb-2'>
            Bienvenido
          </h1>
          <p className='text-center text-white mb-6'>Ingresa en tu cuenta</p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.email && (
                <div className='text-red-300 text-sm mt-1'>{errors.email}</div>
              )}
            </div>

            <div>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Contraseña'
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.password && (
                <div className='text-red-300 text-sm mt-1'>
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-3 px-4 bg-[#A855F7] text-white rounded-[5px] hover:bg-[#A855F7]/70 transition-colors disabled:opacity-70'
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className='mt-6 flex justify-between'>
            <span className='text-white'>No tienes una cuenta?</span>
            <Link to='/register' className='text-[#D8B4FE] hover:underline'>
              Regístrate
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
