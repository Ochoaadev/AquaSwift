import React, { useState } from "react";
import { useItemsContext, useUpItemsContext } from "../../contexts/UpProvider";
import { api } from "../../service/apiService";
import equipo from "/equipo.png";
import editar from "/editar.png";
import eliminar from "/eliminar.png";
import AgregarCompetencia from "../../components/AgregarCompetencia";
import MasInfo from "../../components/MasInfo"; // Importar MasInfo

const Acuatlon = () => {
  const { items } = useItemsContext();
  const { fetchData } = useUpItemsContext();

  const handleDeleteCompetencia = async (id) => {
    try {
      await api.competencia.deleteCompetencia(id);
      await fetchData(); // Actualizar la lista sin recargar
    } catch (error) {
      console.error("Error al eliminar la competencia:", error);
    }
  };

  return (
    <div className="p-6 md:w-11/12 lg:w-5/6 mx-auto poppins">
      <div className="flex items-center justify-center">
        <img src={equipo} alt="equipo" className="lg:w-1/12 md:w-2/12 w-3/12 mr-4" />
        <div className="flex flex-col justify-start items-start">
          <h1 className="text-xl lg:text-5xl md:text-4xl font-bold lg:mt-6 mt-12 text-center">Competencias de</h1>
          <h1 className="text-xl lg:text-5xl md:text-4xl font-bold text-center"><span className="text-primary-400">Acuatlón</span> Disponibles</h1>
        </div>
      </div>

      <AgregarCompetencia />

      <div>
        <h1 className="text-4xl mt-5 font-bold text-primary-300">Acuatlón</h1>
        <div className="w-8/12 md:w-5/12 lg:w-3/12 h-1 bg-primary-0 mb-5"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          {items
            .filter((comp) => comp.Disciplina === "Acuatlon")
            .map((competencia) => (
              <CompetenciaCard
                key={competencia._id}
                competencia={competencia}
                onDelete={() => handleDeleteCompetencia(competencia._id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const CompetenciaCard = ({ competencia, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompetencia, setEditedCompetencia] = useState({ ...competencia });
  const { fetchData } = useUpItemsContext(); // Para actualizar después de guardar
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCompetencia((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await api.competencia.updateCompetencia(competencia._id, editedCompetencia);
      await fetchData(); // Refrescar datos para ver los cambios en tiempo real
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la competencia:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedCompetencia({ ...competencia });
    setIsEditing(false);
  };

  return (
    <>
      <MasInfo 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        competencia={competencia} 
      />
      <div className="bg-primary-300 rounded-xl transition hover:scale-105 duration-200 p-5 flex flex-col lg:flex-row justify-start items-center gap-5">
        <img
          src={competencia.Imagen?.url}
          alt={competencia.Nombre}
          className="h-48 w-72 rounded-lg mx-auto lg:mx-0 sm:w-64 md:w-72 lg:w-90 lg:h-56"
        />
        <div className="grid justify-center items-center -mt-4 md:-mt-4 lg:mt-0">
          {isEditing ? (
            <div className="flex flex-col items-center mt-2">
              <input
                type="text"
                name="Nombre"
                value={editedCompetencia.Nombre}
                onChange={handleInputChange}
                className="text-primary-100 text-sm mb-2 border p-2 rounded-xl w-52"
              />
              <input
                type="date"
                name="Fecha"
                value={editedCompetencia.Fecha}
                onChange={handleInputChange}
                className="text-primary-100 text-sm mb-2 border p-2 rounded-xl w-52"
              />
              <input
                name="Categoria"
                value={editedCompetencia.Categoria.map((cat) => cat.Nombre).join(", ")}
                onChange={handleInputChange}
                className="text-primary-100 text-sm mb-2 border p-2 rounded-xl w-52"
              />
              <select
                name="Genero"
                value={editedCompetencia.Genero}
                onChange={handleInputChange}
                className="text-primary-100 text-sm mb-2 border p-2 rounded-xl w-52"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Mixto">Mixto</option>
              </select>
              <div className="flex gap-2 mt-3">
                <button onClick={handleCancelClick} className="text-center bg-red-600 text-white font-bold rounded-xl p-2">
                  Cancelar
                </button>
                <button onClick={handleSaveClick} className="text-center bg-blue-600 text-white font-bold rounded-xl p-2">
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-2xl font-semibold text-center lg:text-left">{competencia.Nombre}</h4>
              <p className="text-lg text-center lg:text-left"><span className="font-bold">Fecha: </span>{new Date(competencia.Fecha).toLocaleDateString()}</p>
              <p className="text-lg text-center lg:text-left"><span className="font-bold">Categoría: </span>{competencia.Categoria.map((cat) => cat.Nombre).join(", ")}</p>
              <p className="text-lg text-center lg:text-left"><span className="font-bold">Disciplina: </span>{competencia.Disciplina}</p>
              <p className="text-lg text-center lg:text-left"><span className="font-bold">Género: </span>{competencia.Genero}</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 lg:justify-start gap-2 mt-2">
                <button
                  onClick={() => setIsModalOpen(true)} // Abrir el modal
                  className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold transition hover:scale-105 duration-200 py-1 px-3 rounded-xl"
                >
                  Más Info
                </button>
                <div className="flex gap-3">
                  <button onClick={onDelete} className="w-6/12 bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition hover:scale-105 duration-200 flex items-center justify-center">
                    <img src={eliminar} alt="Eliminar" className="w-5 h-5" />
                  </button>
                  <button onClick={handleEditClick} className="w-6/12 bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition hover:scale-105 duration-200 flex items-center justify-center">
                    <img src={editar} alt="Editar" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Acuatlon;
