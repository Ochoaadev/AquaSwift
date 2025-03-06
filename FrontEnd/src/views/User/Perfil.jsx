import React, { useEffect, useState } from 'react';
import { api } from '../../service/apiService';
import perfil from "/Perfil.png";

const Perfil = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Nombre_Apellido: '',
    Username: '',
    Email: '',
    DNI: '',
    Fecha_Nacimiento: ''
  });

  const userId = localStorage.getItem('_id'); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await api.user.getProfile(userId);
        setUserProfile(profile);
        setFormData({
          Nombre_Apellido: profile.Nombre_Apellido,
          Username: profile.Username,
          Email: profile.Email,
          DNI: profile.DNI,
          Fecha_Nacimiento: profile.Fecha_Nacimiento
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    } else {
      console.error('User ID is not available in localStorage');
      setLoading(false);
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleClick = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.user.updateProfile(userId, formData, token);

      // Actualizamos directamente el perfil con los nuevos datos
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        ...formData
      }));

      setIsEditing(false); // Ocultamos el formulario después de la actualización
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      Nombre_Apellido: userProfile.Nombre_Apellido,
      Username: userProfile.Username,
      Email: userProfile.Email,
      DNI: userProfile.DNI,
      Fecha_Nacimiento: userProfile.Fecha_Nacimiento
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div className='poppins text-center mx-auto mt-5 text-2xl w-5/6'>No se pudo cargar el perfil.
    </div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="mx-auto w-5/6 my-5 poppins text-center">
      <div className="grid justify-center items-center text-center">
        <img src={perfil} alt="Perfil" className="w-2/6 rounded mx-auto" />
        <h1 className="text-4xl mb-4 text-center">Perfil de Usuario</h1>
      </div>

      <div className="bg-primary-100 lg:w-5/12 md:w-10/12 mx-auto p-8 rounded-xl">
        <h1 className="text-3xl font-bold">Hola!</h1>
        <h1 className="text-3xl text-primary-500 -mt-1 font-bold">{userProfile.Nombre_Apellido}</h1>

        {!isEditing ? (
          <div className="lg:text-2xl md:text-2xl text-xl">
            <p className="font-bold">Username: <span className="font-light">{userProfile.Username}</span></p>
            <p className="font-bold">Email: <span className="font-light">{userProfile.Email}</span></p>
            <p className="font-bold">DNI: <span className="font-light">{userProfile.DNI}</span></p>
            <p className="font-bold">Género: <span className="font-light">{userProfile.Genero}</span></p>
            <p className="font-bold">Fecha N: <span className="font-light">{formatDate(userProfile.Fecha_Nacimiento)}</span></p>
            <button
              onClick={() => setIsEditing(true)}
              className="animate-bounce bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-secondary-50 font-bold py-2 px-4 rounded-xl mt-3">
              Editar Perfil
            </button>
          </div>
        ) : (
          <div className="mt-3 text-xl text-start transition-all duration-500 ease-in-out">
            <div>
              <label htmlFor="Nombre_Apellido">Nombre y Apellido:</label>
              <input
                type="text"
                id="Nombre_Apellido"
                name="Nombre_Apellido"
                value={formData.Nombre_Apellido}
                onChange={handleInputChange}
                className="border p-2 mt-1 mb-3 w-full rounded-xl"
                style={{ color: 'rgb(59, 130, 246)' }}
                placeholder={userProfile.Nombre_Apellido}
              />
            </div>
            <div>
              <label htmlFor="Username">Username:</label>
              <input
                type="text"
                id="Username"
                name="Username"
                value={formData.Username}
                onChange={handleInputChange}
                className="border p-2 mt-1 mb-3 w-full  rounded-xl"
                style={{ color: 'rgb(59, 130, 246)' }}
                placeholder={userProfile.Username}
              />
            </div>
            <div>
              <label htmlFor="Email">Email:</label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                className="border p-2 mt-1 mb-3 w-full  rounded-xl"
                style={{ color: 'rgb(59, 130, 246)' }}
                placeholder={userProfile.Email}
              />
            </div>
            <div>
              <label htmlFor="DNI">DNI:</label>
              <input
                type="text"
                id="DNI"
                name="DNI"
                value={formData.DNI}
                onChange={handleInputChange}
                className="border p-2 mt-1 mb-3 w-full  rounded-xl"
                style={{ color: 'rgb(59, 130, 246)' }}
                placeholder={userProfile.DNI}
              />
            </div>
            <div>
              <label htmlFor="Fecha_Nacimiento">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="Fecha_Nacimiento"
                name="Fecha_Nacimiento"
                value={formData.Fecha_Nacimiento}
                onChange={handleInputChange}
                className="border p-2 mt-1 mb-3 w-full  rounded-xl"
                style={{ color: 'rgb(59, 130, 246)' }}
                placeholder={formatDate(userProfile.Fecha_Nacimiento)}
              />
            </div>
            <div className="flex gap-5 justify-center mt-3">
              <button
                onClick={handleClick}
                className="transition lg:text-2xl md:text-2xl text-sm hover:scale-105 duration-200 bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-secondary-50 font-bold py-2 px-4 rounded-xl">
                Guardar Cambios
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition hover:scale-105 duration-200">
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
