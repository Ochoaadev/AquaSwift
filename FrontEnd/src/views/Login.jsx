import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Enviar los datos de inicio de sesión al backend
      const response = await axios.post('http://localhost:4000/api/login', {
        email: formData.email,
        password: formData.password
      });

      // Si el inicio de sesión es exitoso, redirigir a /userhome
      if (response.status === 200) {
        navigate('/userHome');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrors({ submit: 'Email o contraseña incorrectos' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full max-w-md p-8 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#9333EA]'>
      <h1 className='text-3xl font-bold text-center text-white mb-2'>
        Bienvenido
      </h1>
      <p className='text-center text-white mb-6'>Ingresa en tu cuenta</p>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Campo de Email */}
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

        {/* Campo de Contraseña */}
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

        {/* Botón de Iniciar Sesión */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-3 px-4 bg-[#A855F7] text-white rounded-[5px] hover:bg-[#A855F7]/70 transition-colors disabled:opacity-70'
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Enlace a Registro */}
      <div className='mt-6 flex justify-between'>
        <span className='text-white'>No tienes una cuenta?</span>
        <Link
          to='/register'
          className='text-[#D8B4FE] hover:underline hover:text-[#D8B4FE]/70'
        >
          Regístrate
        </Link>
      </div>

      {/* Mostrar errores de inicio de sesión */}
      {errors.submit && (
        <div className='mt-4 text-red-300 text-sm text-center'>
          {errors.submit}
        </div>
      )}
    </div>
  );
};

export default Login;