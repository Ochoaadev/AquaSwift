import React, { useEffect, useState, useContext } from 'react';
import { api } from '../../service/apiService';
import { AuthContext } from '../../contexts/AuthProvider';
import Usuario from "/usuario.png";
import UserFilter from "../../components/userFilter";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
};

function AdminUsuarios() {
  const { token } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Almacenamos el usuario que estamos editando
  const [formData, setFormData] = useState({
    Nombre_Apellido: '',
    Username: '',
    Email: '',
    DNI: '',
    Fecha_Nacimiento: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.user.getAllUsers(token);
        setUsuarios(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.user.deleteUser(id, token);
      setUsuarios(usuarios.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      Nombre_Apellido: user.Nombre_Apellido,
      Username: user.Username,
      Email: user.Email,
      DNI: user.DNI,
      Fecha_Nacimiento: user.Fecha_Nacimiento
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await api.user.updateProfile(currentUser._id, formData, token);
      // Actualizar la lista de usuarios
      setUsuarios(usuarios.map(user => user._id === currentUser._id ? { ...user, ...formData } : user));
      setIsEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      Nombre_Apellido: currentUser.Nombre_Apellido,
      Username: currentUser.Username,
      Email: currentUser.Email,
      DNI: currentUser.DNI,
      Fecha_Nacimiento: currentUser.Fecha_Nacimiento
    });
  };

  // Búsqueda por nombre o username
  const handleSearch = (searchTerm) => {
    const filtered = usuarios.filter((user) =>
      user.Nombre_Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Filtro por género
  const handleFilterGender = (gender) => {
    const filtered = gender ? usuarios.filter((user) => user.Genero === gender) : usuarios;
    setFilteredUsers(filtered);
  };

  // Ordenar por edad
  const handleSortAge = (order) => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const ageA = new Date().getFullYear() - new Date(a.Fecha_Nacimiento).getFullYear();
      const ageB = new Date().getFullYear() - new Date(b.Fecha_Nacimiento).getFullYear();
      return order === "asc" ? ageA - ageB : ageB - ageA;
    });
    setFilteredUsers(sorted);
  };

  return (
    <div className="p-6 w-5/6 mx-auto poppins ">
      <div className="flex flex-col">
        <div className="flex items-center">
          <img src={Usuario} alt="Usuario" className="lg:w-1/12 md:w-2/12 w-4/12 mr-4" />
          <h1 className="lg:text-5xl md:text-5xl text-4xl font-bold  lg:mt-12 md:mt-12 mt-2">
            <span className="text-primary-100">Usuarios</span> Inscritos
          </h1>
        </div>
        <div className="w-full h-2 bg-primary-0 mt-3 mb-5"></div>
      </div>

      <UserFilter onSearch={handleSearch} onSortAge={handleSortAge} onFilterGender={handleFilterGender} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {filteredUsers.map((user) => (
          <div key={user._id} className="bg-primary-300 shadow-md rounded-lg p-4 transition hover:scale-105 duration-200">
          {!isEditing || currentUser._id !== user._id ? (
            <>
              <h2 className="text-3xl font-bold text-center text-primary-500">{user.Nombre_Apellido}</h2>
              <div className='text-white text-center lg:text-xl mg:text-lg text-lg'>
                <p className="font-bold">Username:  
                  <span className='font-medium '> {user.Username}</span>
                </p>
                <p className=""> {user.Email}</p>
                <p className="font-bold">Cédula:  
                  <span className='font-medium '> {user.DNI}</span>
                </p>
                <p className="font-bold">Género:  
                  <span className='font-medium '> {user.Genero}</span>
                </p>
                <p className="font-bold">Fecha N:  
                  <span className='font-medium '> {formatDate(user.Fecha_Nacimiento)}</span>
                </p>
              </div>
              <div className="mt-4 flex space-x-2 justify-center text-xl">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white  font-bold px-3 py-1 rounded-xl hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-3 font-bold py-1 rounded-xl hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 text-xl text-start transition-all duration-500 ease-in-out">
              <div>
                <label htmlFor="Nombre_Apellido" className='text-md'>Nombre y Apellido: </label>
                <input
                  type="text"
                  id="Nombre_Apellido"
                  name="Nombre_Apellido"
                  value={formData.Nombre_Apellido}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-3 rounded-xl text-sm"
                  placeholder={user.Nombre_Apellido} // Aquí establecemos el valor original como placeholder
                  style={{ color: 'rgb(59, 130, 246)' }}
                />
              </div>
              <div>
                <label htmlFor="Username" className='text-md'>Username:</label>
                <input
                  type="text"
                  id="Username"
                  name="Username"
                  value={formData.Username}
                  onChange={handleInputChange}
                  className="border p-2 mt-1 mb-2 w-full rounded-xl text-sm"
                  placeholder={user.Username} // Placeholder con el valor original
                  style={{ color: 'rgb(59, 130, 246)' }}
                />
              </div>
              <div>
                <label htmlFor="Email" className='text-md'>Email:</label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="border p-2 mt-1 mb-2 w-full rounded-xl text-sm"
                  placeholder={user.Email} // Placeholder con el valor original
                  style={{ color: 'rgb(59, 130, 246)' }}
                />
              </div>
              <div>
                <label htmlFor="DNI" className='text-md'>DNI:</label>
                <input
                  type="text"
                  id="DNI"
                  name="DNI"
                  value={formData.DNI}
                  onChange={handleInputChange}
                  className="border p-2 mt-1 mb-2 w-full rounded-xl text-sm"
                  placeholder={user.DNI} // Placeholder con el valor original
                  style={{ color: 'rgb(59, 130, 246)' }}
                />
              </div>
              <div>
                <label htmlFor="Fecha_Nacimiento" className='text-md'>Fecha de Nacimiento:</label>
                <input
                  type="date"
                  id="Fecha_Nacimiento"
                  name="Fecha_Nacimiento"
                  value={formData.Fecha_Nacimiento}
                  onChange={handleInputChange}
                  className="border p-2 mt-1 mb-2 w-full rounded-xl text-sm"
                  placeholder={formatDate(user.Fecha_Nacimiento)} // Placeholder con el valor original
                  style={{ color: 'rgb(59, 130, 246)' }}
                />
              </div>
              <div className="flex gap-5 justify-center mt-1">
                <button
                  onClick={handleSaveChanges}
                  className="transition lg:text-xl md:text-md text-sm hover:scale-105 duration-200 bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-secondary-50 font-bold py-2 px-4 rounded-xl">
                  Guardar Cambios
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition hover:scale-105 duration-200">
                  X
                </button>
              </div>
            </div>
          )}
        </div>        
        ))}
      </div>
    </div>
  );
}

export default AdminUsuarios;
