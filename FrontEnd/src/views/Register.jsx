import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
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
    const newErrors = {};
    if (!formData.nombreApellido) newErrors.nombreApellido = 'Nombre y Apellido es requerido';
    if (!formData.username) newErrors.username = 'Username es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.dni) newErrors.dni = 'DNI es requerido';
    if (!formData.genero) newErrors.genero = 'Género es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de Nacimiento es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:4000/api/registro', {
        Nombre_Apellido: formData.nombreApellido,
        Username: formData.username,
        Email: formData.email,
        Contrasena: formData.password,
        DNI: formData.dni,
        Genero: formData.genero,
        Fecha_Nacimiento: formData.fechaNacimiento
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

    <div className='mx-auto w-full max-w-md p-8 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#9333EA] mt-8'>
      <h1 className='text-3xl font-bold text-center text-white mb-6 '>
        Registrate con <span className='text-[#BEB5F9]'>nosotros!</span>
      </h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Nombre y Apellido */}
        <div>
          <input
            type='text'
            name='nombreApellido'
            value={formData.nombreApellido}
            onChange={handleChange}
            placeholder='Nombre y Apellido'
            style={{ background: "transparent" }}
            className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
          />
          {errors.nombreApellido && (
            <div className='text-red-300 text-sm mt-1'>
              {errors.nombreApellido}
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Username'
            style={{ background: "transparent" }}
            className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
          />
          {errors.username && (
            <div className='text-red-300 text-sm mt-1'>
              {errors.username}
            </div>
          )}
        </div>

        {/* Email */}
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

        {/* Contraseña */}
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

        {/* Confirmar Contraseña */}
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

        {/* DNI */}
        <div>
          <input
            type='number'
            name='dni'
            value={formData.dni}
            onChange={handleChange}
            placeholder='DNI'
            style={{ background: "transparent" }}
            className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
          />
          {errors.dni && (
            <div className='text-red-300 text-sm mt-1'>{errors.dni}</div>
          )}
        </div>

        {/* Género (Select) */}
        <div>
          <select
            name='genero'
            value={formData.genero}
            onChange={handleChange}
            style={{ background: "transparent" }}
            className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
          >
            <option value='' disabled>Selecciona tu género</option>
            <option value='Masculino'>Masculino</option>
            <option value='Femenino'>Femenino</option>
          </select>
          {errors.genero && (
            <div className='text-red-300 text-sm mt-1'>{errors.genero}</div>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <input
            type='date'
            name='fechaNacimiento'
            value={formData.fechaNacimiento}
            onChange={handleChange}
            style={{ background: "transparent" }}
            className='w-full py-3 bg-transparent border-b border-white/30 text-[#fff] placeholder-[#CBD5E1] focus:outline-none'
          />
          {errors.fechaNacimiento && (
            <div className='text-red-300 text-sm mt-1'>
              {errors.fechaNacimiento}
            </div>
          )}
        </div>

        {/* Botón de Registro */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-3 px-4 bg-[#A855F7] text-white rounded-[5px] hover:bg-[#A855F7]/70 transition-colors disabled:opacity-70'
        >
          {isSubmitting ? "Registrando..." : "Registrarme"}
        </button>
      </form>

      {/* Enlace a Iniciar Sesión */}
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

    <Footer />
    </>
  );
};

export default Register;