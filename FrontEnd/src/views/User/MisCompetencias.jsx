import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { api } from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import CompetenciasFilter from '../../components/competenciasFilter';
import trofeo from "/trofeo.png";

const MisCompetencias = () => {
  const { user } = useContext(AuthContext);
  const [inscripcionesAgrupadas, setInscripcionesAgrupadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pruebasSeleccionadas, setPruebasSeleccionadas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("_id");
        if (!userId) {
          navigate("/login");
          return;
        }

        const token = localStorage.getItem("token");
        
        // Obtener las inscripciones del atleta
        const response = await api.inscripcion.getByAtleta(userId, token);
        
        // Procesar la respuesta
        let inscripcionesData = [];
        
        if (Array.isArray(response)) {
          inscripcionesData = response;
        } else if (response?.data) {
          inscripcionesData = response.data;
        } else if (response?.inscripciones) {
          inscripcionesData = response.inscripciones;
        }

        // Filtrar inscripciones válidas con competencia y prueba
        const inscripcionesValidas = inscripcionesData.filter(
          insc => insc && 
                 insc._id && 
                 insc.Competencia && 
                 insc.Prueba &&
                 insc.Competencia.Imagen
        );

        // Agrupar inscripciones por competencia
        const agrupadas = inscripcionesValidas.reduce((acc, inscripcion) => {
          const competenciaId = inscripcion.Competencia._id;
          
          if (!acc[competenciaId]) {
            acc[competenciaId] = {
              competencia: inscripcion.Competencia,
              pruebas: [],
              fechaInscripcion: inscripcion.FechaInscripcion,
              estado: inscripcion.Estado
            };
          }
          
          acc[competenciaId].pruebas.push(inscripcion.Prueba);
          // Mantener la fecha de inscripción más reciente
          if (new Date(inscripcion.FechaInscripcion) > new Date(acc[competenciaId].fechaInscripcion)) {
            acc[competenciaId].fechaInscripcion = inscripcion.FechaInscripcion;
          }
          
          return acc;
        }, {});

        setInscripcionesAgrupadas(organizarCompetenciasPorDisciplina(Object.values(agrupadas)));
      } catch (err) {
        console.error("Error al obtener inscripciones:", err);
        setError("Error al cargar tus competencias");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const openModal = (pruebas) => {
    setPruebasSeleccionadas(pruebas);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setPruebasSeleccionadas([]);
  };
  

  const getDisciplinaStyles = (disciplina) => {
    const colorClasses = ["text-primary-100", "text-primary-300", "text-primary-400"];
    const bgColorClasses = ["bg-primary-150", "bg-primary-300", "bg-primary-450"];
  
    // Determina el índice basado en la disciplina
    let index;
    switch (disciplina.toLowerCase()) {
      case "natacion":
        index = 0;
        break;
      case "acuatlon":
        index = 1;
        break;
      case "triatlon":
        index = 2;
        break;
      default:
        index = 3;
        break;
    }
  
    // Devuelve un objeto con las clases de texto y fondo
    return {
      textClass: colorClasses[index] || "text-primary-100",   // Clase para el texto
      bgClass: bgColorClasses[index] || "bg-primary-150"      // Clase para el fondo
    };
  };
  
  

  const organizarCompetenciasPorDisciplina = (inscripciones) => {
    return inscripciones.reduce((acc, grupo) => {
      const disciplina = grupo.competencia.Disciplina || "Otros";
  
      if (!acc[disciplina]) {
        acc[disciplina] = [];
      }
  
      acc[disciplina].push(grupo);
      return acc;
    }, {});
  };
  
  

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 my-6">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto py-8 w-5/6">
      <div className="p-6 md:w-11/12 lg:w-5/6 mx-auto poppins">
        <div className="flex items-center justify-center">
          <img src={trofeo} alt="trofeo" className="lg:w-1/12 md:w-2/12 w-3/12 mr-1" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold lg:mt-12 md:mt-12 mt-3 text-start">Mis Competencias</h1>
        </div>
        <CompetenciasFilter />
      </div>
  
      {inscripcionesAgrupadas.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <p>No tienes inscripciones activas en este momento.</p>
        </div>
      ) : Object.entries(inscripcionesAgrupadas).map(([disciplina, grupos]) => {
        // Obtener las clases para fondo y texto de la disciplina
        const { bgClass, textClass } = getDisciplinaStyles(disciplina);
  
        return (
          <div key={disciplina}>
            <h1 className={`text-4xl mt-5 font-bold ${textClass}`}>{disciplina}</h1>
            <div className="w-8/12 md:w-5/12 lg:w-3/12 h-1 bg-primary-0 mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
              {grupos.map((grupo, index) => {
                // Usar las clases bgClass para el fondo
                return (
                  <div
                    key={index}
                    className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${bgClass}`}
                  >
                    <div className="grid grid-cols-2">
                      {/* Sección de imagen */}
                      <div className="p-4 flex justify-center items-center">
                        <img
                          src={grupo.competencia.Imagen.url || "/default-competition.jpg"}
                          alt={grupo.competencia.Nombre}
                          className="h-48 w-72 rounded-lg mx-auto lg:mx-0 sm:w-64 md:w-72 lg:w-90 lg:h-56"
                          onError={(e) => {
                            e.target.src = "/default-competition.jpg";
                          }}
                        />
                      </div>
  
                      {/* Sección de información */}
                      <div className="p-3 mt-3 w-full">
                        {/* Encabezado con nombre de competencia */}
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-bold text-gray-800">
                            {grupo.competencia.Nombre || "Competencia no especificada"}
                          </h2>
                        </div>
  
                        {/* Detalles de la inscripción */}
                        <div className="grid gap-4 mb-1 text-lg">
                          <div>
                            <p className=" text-gray-100 font-bold">Fecha de inscripción:</p>
                            <p className="text-gray-800 -mt-1">
                              {grupo.fechaInscripcion
                                ? new Date(grupo.fechaInscripcion).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                  })
                                : "Fecha no disponible"}
                            </p>
                            <div>
                              <p className=" text-gray-100 mt-2 font-bold">Fecha competencia:</p>
                              <p className="text-gray-800 -mt-1">
                                {grupo.competencia.Fecha
                                  ? new Date(grupo.competencia.Fecha).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric'
                                    })
                                  : "Por definir"}
                              </p>
                            </div>
                          </div>
                        </div>
  
                        <div className="grid grid-cols-1 mx-auto">
                          <div className="mb-1">
                            <button 
                              onClick={() => openModal(grupo.pruebas)}
                              className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold py-1 px-3 rounded-lg transition hover:scale-105 duration-200"
                            >
                              Ver Pruebas
                            </button>
                          </div>
                          <div>
                            <button 
                              className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold py-1 px-3 rounded-lg transition hover:scale-105 duration-200"
                              disabled
                              title="Funcionalidad próximamente disponible"
                            >
                              Mostrar resultados
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
  
      {/* Modal para mostrar las pruebas */}
      {modalOpen && (
        <div className="text-black fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold text-center mb-2">Pruebas Inscritas</h3>
            <ul className="grid grid-cols-2 gap-1">
              {pruebasSeleccionadas.map((prueba, i) => (
                <li
                  key={i}
                  className="bg-gray-100 text-center py-2 px-3 rounded text-sm font-medium text-gray-800"
                >
                  {prueba.Nombre}
                </li>
              ))}
            </ul>
  
            {/* Contenedor para centrar el botón */}
            <div className="w-full flex justify-center mt-2">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default MisCompetencias;