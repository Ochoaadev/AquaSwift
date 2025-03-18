import React, { useEffect, useState } from 'react';
import { api } from '../../service/apiService';
import { useItemsContext } from '../../contexts/UpProvider';
import equipo from "/equipo.png";

const UserHome = () => {
  const [nombre, setNombre] = useState('');
  const userId = localStorage.getItem('_id');
  const { items } = useItemsContext();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profile = await api.user.getProfile(userId);
        setNombre(profile.Nombre_Apellido); 
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) {
      fetchUserName();
    } else {
      console.error('User ID is not available in localStorage');
    }
  }, [userId]);

  return (
    <div className='mx-auto w-5/6 my-5'>
      <div className='text-center my-4 text-2xl lg:text-4xl md:text-3xl'>
        <h1 className='font-bold'>Bienvenido <span className='text-primary-100'>{nombre}</span></h1>
        <h1>¿Estás listo para competir?</h1>
      </div>

      <div>
        {["Natacion", "Acuatlon", "Triatlon"].map((disciplina, index) => {
          const colorClasses = ["text-primary-100", "text-primary-300", "text-primary-400"];
          const bgColorClasses = ["bg-primary-150", "bg-primary-300", "bg-primary-450"]; // Nuevas clases de fondo
          const competencias = items.filter((comp) => comp.Disciplina === disciplina);

          return (
            <div key={disciplina}>
              <h1 className={`text-4xl mt-5 font-bold ${colorClasses[index]}`}>{disciplina}</h1>
              <div className="w-8/12 md:w-5/12 lg:w-3/12 h-1 bg-primary-0 mb-5"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-12">
                {competencias.map((competencia) => (
                  <CompetenciaCard
                    key={competencia._id}
                    competencia={competencia}
                    bgColorClass={bgColorClasses[index]} // Pasar la clase de fondo al card
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CompetenciaCard = ({ competencia, bgColorClass }) => {
  return (
    <div className={`${bgColorClass} rounded-xl p-5  flex flex-col lg:flex-row justify-center items-center gap-5 transition hover:scale-105 duration-200`}>
      <img
        src={competencia.Imagen?.url}
        alt={competencia.Nombre}
        className="h-48 w-72 rounded-lg mx-auto lg:mx-0 sm:w-64 md:w-72 lg:w-90 lg:h-56"
      />

      <div className="grid justify-center items-center -mt-4 md:-mt-4 lg:mt-0">
        <div>
          <h4 className="text-2xl font-semibold text-center lg:text-left">{competencia.Nombre}</h4>
          <p className="text-lg text-center lg:text-left"><span className="font-bold">Fecha: </span>{new Date(competencia.Fecha).toLocaleDateString()}</p>
          <p className="text-lg text-center lg:text-left"><span className="font-bold">Categoría: </span>{competencia.Categoria.map((cat) => cat.Nombre).join(", ")}</p>
          <p className="text-lg text-center lg:text-left"><span className="font-bold">Disciplina: </span>{competencia.Disciplina}</p>
          <p className="text-lg text-center lg:text-left"><span className="font-bold">Género: </span>{competencia.Genero}</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 lg:justify-start gap-2 mt-2">
            <button className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold py-1 px-3 rounded-xl transition hover:scale-105 duration-200">
              Más Info
            </button>

            <button className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold py-1 px-3 rounded-xl transition hover:scale-105 duration-200">
              Inscribirme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
