import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const { signUp } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombreApellido: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dni: '',
    genero: '',
    fechaNacimiento: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombreApellido) errors.nombreApellido = true;
    if (!formData.username) errors.username = true;
    if (!formData.email) errors.email = true;
    if (!formData.password) errors.password = true;
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = true;
    if (!formData.dni) errors.dni = true;
    if (!formData.genero) errors.genero = true;
    if (!formData.fechaNacimiento) errors.fechaNacimiento = true;

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await signUp({
        Nombre_Apellido: formData.nombreApellido,
        Username: formData.username,
        Email: formData.email,
        Contrasena: formData.password,
        DNI: formData.dni,
        Genero: formData.genero,
        Fecha_Nacimiento: formData.fechaNacimiento,
      });
      
      if (response.status === 200) {
        navigate('/login');
      }
    
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrors({ submit: 'Error al registrar el usuario' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

    <div className='px-2 w-11/12 mx-auto mt-5'>
      <div className='mx-auto max-w-lg p-8 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#9333EA] mt-8'>
        <h1 className='text-3xl font-bold text-center text-white mb-6 animate-fade-in'>
          Registrate con <span className='text-[#BEB5F9]'>nosotros!</span>
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nombre y Apellido */}
          <div className="relative">
            <input
              type='text'
              name='nombreApellido'
              value={formData.nombreApellido}
              onChange={handleChange}
              placeholder={errors.nombreApellido ? 'Nombre y Apellido *' : 'Nombre y Apellido'}
              style={{ background: "transparent" }}
              className={`w-full py-3 bg-transparent border-b ${
                errors.nombreApellido ? 'font-bold' : 'font-medium'
              } text-[#fff] ${
                errors.nombreApellido ? 'border-[#FF0000] border-b-2' : 'border-[#CBD5E1]'
              } focus:outline-none focus:scale-105 transition-all duration-300`}
            />
          </div>

          {/* Username */}
          <div className="relative">
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder={errors.username ? 'Username *' : 'Username'}
              style={{ background: "transparent" }}
              className={`w-full py-3 bg-transparent border-b ${
                errors.username ? 'font-bold' : 'font-medium'
              } text-[#fff] ${
                errors.username ? 'border-[#FF0000] border-b-2' : 'border-[#CBD5E1]'
              } focus:outline-none focus:scale-105 transition-all duration-300`}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder={errors.email ? 'Email *' : 'Email'}
              style={{ background: "transparent" }}
              className={`w-full py-3 bg-transparent border-b ${
                errors.email ? 'font-bold' : 'font-medium'
              } text-[#fff] ${
                errors.email ? 'border-[#FF0000]  border-b-2' : 'border-[#CBD5E1]'
              } focus:outline-none focus:scale-105 transition-all duration-300`}
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder={errors.password ? 'Contraseña *' : 'Contraseña'}
              style={{ background: "transparent" }}
              className={`w-full py-3 bg-transparent border-b ${
                errors.password ? 'font-bold' : 'font-medium'
              } text-[#fff] ${
                errors.password ? 'border-[#FF0000] border-b-2' : 'border-[#CBD5E1]'
              } focus:outline-none focus:scale-105 transition-all duration-300`}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="relative">
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={errors.confirmPassword ? 'Confirmar Contraseña *' : 'Confirmar Contraseña'}
              style={{ background: "transparent" }}
              className={`w-full py-3 bg-transparent border-b ${
                errors.confirmPassword ? 'font-bold' : 'font-medium'
              } text-[#fff] ${
                errors.confirmPassword ? 'border-[#FF0000] border-b-2' : 'border-[#CBD5E1]'
              } focus:outline-none focus:scale-105 transition-all duration-300`}
            />
          </div>

          {/* DNI */}
          <div className="relative">
            <input
              type='number'
              name='dni'
              value={formData.dni}
              onChange={handleChange}
              placeholder={errors.dni ? 'DNI *' : 'DNI'}
              style={{ background: "transparent" }}
              className={`w-full py-3 bg-transparent border-b ${
                errors.dni ? 'font-bold' : 'font-medium'
              } text-[#fff] ${
                errors.dni ? 'border-[#FF0000] border-b-2' : 'border-[#CBD5E1]'
              } focus:outline-none focus:scale-105 transition-all duration-300`}
            />
          </div>

          {/* Género (Select) */}
          <div className="relative">
          <select
            name='genero'
            value={formData.genero}
            onChange={handleChange}
            className={`
              w-full py-3 bg-transparent border-b 
              ${errors.genero ? 'font-bold' : 'font-medium'} 
              text-[#FFFFFF] focus:outline-none focus:scale-105 transition-all duration-300 
              ${
                errors.genero && !formData.genero
                  ? 'border-[#FF0000] border-b-2'
                  : 'border-[#CBD5E1]'
              }
              sm:text-sm md:text-base lg:text-lg
            `}
          >
            <option value='' disabled className='bg-[#FFFFFF] text-[#FFFFFF]'>
              {errors.genero ? 'Selecciona tu género *' : 'Selecciona tu género'}
            </option>
            <option value='Masculino' className='text-[#FFFFFF] bg-primary-100'>
              Masculino
            </option>
            <option value='Femenino' className='text-[#FFFFFF] bg-primary-100'>
              Femenino
            </option>
          </select>
        </div>
         
          {/* Fecha de Nacimiento */}
          <div className="relative">
              <input
                type='date'
                name='fechaNacimiento'
                value={formData.fechaNacimiento}
                onChange={handleChange}
                style={{ background: "transparent" }}
                className={`w-full py-3 bg-transparent border-b ${
                  errors.fechaNacimiento ? 'border-[#FF0000] border-b-2' : 'border-[#CBD5E1]'
                } text-[#fff] focus:outline-none ${
                  errors.fechaNacimiento && !formData.fechaNacimiento ? 'text-[#FF0000]' : 'text-[#CBD5E1]'
                }`}
              />
            </div>

          {/* Mensaje de error general */}
          {Object.keys(errors).length > 0 && (
            <div className="text-[#FF0000] text-md text-center font-bold mb-4 animate-fade-in">
              Todos los campos son requeridos
            </div>
          )}

          {/* Botón de Registro */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-3 px-4 bg-[#A855F7] text-white rounded-[5px] hover:bg-[#A855F7]/70 transition-colors duration-300 disabled:opacity-70'
          >
            {isSubmitting ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        {/* Enlace a Iniciar Sesión */}
        <div className='mt-6 flex justify-between'>
          <span className='text-white'>Ya tienes una cuenta?</span>
          <Link
            to='/login'
            className='text-[#D8B4FE] hover:underline hover:text-[#D8B4FE]/70 transition-colors duration-300'
          >
            Inicia Sesión
          </Link>
        </div>
      </div>
      </div>
<Footer />
    </>
  );
};

export default Register;