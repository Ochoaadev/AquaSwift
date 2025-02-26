import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthProvider";
import { api } from "../service/apiService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Register() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    cedula: "",
    birthDate: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCedula = (cedula) => {
    const cedulaRegex = /^[0-9]{8,10}$/;
    return cedulaRegex.test(cedula);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value) {
          newErrors.fullName = "El nombre completo es requerido";
        } else if (value.length < 3) {
          newErrors.fullName = "El nombre debe tener al menos 3 caracteres";
        } else {
          delete newErrors.fullName;
        }
        break;
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
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Confirmar contraseña es requerido";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "gender":
        if (!value) {
          newErrors.gender = "El género es requerido";
        } else {
          delete newErrors.gender;
        }
        break;
      case "cedula":
        if (!value) {
          newErrors.cedula = "La cédula es requerida";
        } else if (!validateCedula(value)) {
          newErrors.cedula = "Cédula inválida";
        } else {
          delete newErrors.cedula;
        }
        break;
      case "birthDate":
        if (!value) {
          newErrors.birthDate = "La fecha de nacimiento es requerida";
        } else {
          const date = new Date(value);
          const today = new Date();
          if (date > today) {
            newErrors.birthDate = "La fecha no puede ser futura";
          } else {
            delete newErrors.birthDate;
          }
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

    // si no hay errores enviar el registro al backend.
    if (Object.keys(errors).length === 0) {
      try {
        console.log("Datos enviados:", formData);
        const response = await api.auth.register(formData);
        login(response.user);
        toast.success(response.message);
        //despuess del registro exitoso redirigir a la pagina principal.
      } catch (error) {
        console.log("Error al enviar:", error);
        toast.error(error?.response?.data?.message || "Error en el registro", {
          position: "bottom-right"
        });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex-grow flex items-center justify-center px-4 py-8'
      >
        <div className='w-full max-w-md p-8 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#9333EA]'>
          <h1 className='text-3xl font-bold text-center text-white mb-6'>
            Registrate con <span className='text-[#BEB5F9]'>nosotros!</span>
          </h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                placeholder='Nombre y Apellido'
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.fullName && (
                <div className='text-red-300 text-sm mt-1'>
                  {errors.fullName}
                </div>
              )}
            </div>

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

            <div>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirmar Contraseña'
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.confirmPassword && (
                <div className='text-red-300 text-sm mt-1'>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div>
              <input
                type='text'
                name='gender'
                value={formData.gender}
                onChange={handleChange}
                placeholder='Género'
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.gender && (
                <div className='text-red-300 text-sm mt-1'>{errors.gender}</div>
              )}
            </div>

            <div>
              <input
                type='text'
                name='cedula'
                value={formData.cedula}
                onChange={handleChange}
                placeholder='Cédula'
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.cedula && (
                <div className='text-red-300 text-sm mt-1'>{errors.cedula}</div>
              )}
            </div>

            <div>
              <input
                type='date'
                name='birthDate'
                value={formData.birthDate}
                onChange={handleChange}
                style={{ background: "transparent" }}
                className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
              />
              {errors.birthDate && (
                <div className='text-red-300 text-sm mt-1'>
                  {errors.birthDate}
                </div>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-3 px-4 bg-[#A855F7] text-white rounded-[5px] hover:bg-[#A855F7]/70 transition-colors disabled:opacity-70'
            >
              {isSubmitting ? "Registrando..." : "Registrarme"}
            </button>
          </form>

          <div className='mt-6 flex justify-between'>
            <span className='text-white'>Ya tienes una cuenta?</span>
            <Link
              to='/login'
              className='text-[#D8B4FE] hover:underline hover:text-[#D8B4FE]/70'
            >
              Inicia Sesión
            </Link>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}