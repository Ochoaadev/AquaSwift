import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { api } from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import trofeo from "/trofeo.png";

const MisCompetencias = () => {
  const { user } = useContext(AuthContext);
  const [inscripcionesAgrupadas, setInscripcionesAgrupadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pruebasSeleccionadas, setPruebasSeleccionadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [competenciaResultados, setCompetenciaResultados] = useState(null);

  const navigate = useNavigate();

  const fetchResultadosCompetencia = async (competenciaId) => {
    try {
      setLoading(true);
      const response = await api.resultado.getByCompetencia(competenciaId);
      
      if (response && typeof response === 'object') {
        const resultadosProcesados = {};
        
        await Promise.all(Object.values(response).map(async (pruebaData) => {
          const pruebaId = pruebaData.Prueba._id;
          const pruebaNombre = pruebaData.Prueba.Nombre;
          
          // Ordenar y asignar posiciones
          const resultadosOrdenados = pruebaData.resultados
            .map(resultado => ({
              ...resultado,
              tiempoEnSegundos: convertirTiempoASegundos(resultado.Marca)
            }))
            .sort((a, b) => a.tiempoEnSegundos - b.tiempoEnSegundos)
            .map((resultado, index) => ({
              ...resultado,
              Posicion: index + 1
            }));
  
          // Actualizar posiciones en la base de datos
          await Promise.all(resultadosOrdenados.map(async (resultado) => {
            try {
              await api.resultado.update(resultado._id, {
                Posicion: resultado.Posicion
              });
            } catch (err) {
              console.error('Error al actualizar posición:', err);
            }
          }));
          
          resultadosProcesados[pruebaId] = {
            nombre: pruebaNombre,
            resultados: resultadosOrdenados
          };
        }));
        
        return resultadosProcesados;
      }
      
      return {};
    } catch (err) {
      console.error('Error al obtener resultados:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const convertirTiempoASegundos = (tiempo) => {
    if (!tiempo) return Infinity;
    
    const partes = tiempo.split(':').map(part => parseFloat(part) || 0);
    
    if (partes.length === 3) {
      return partes[0] * 3600 + partes[1] * 60 + partes[2];
    } else if (partes.length === 2) {
      return partes[0] * 60 + partes[1];
    } else {
      return partes[0];
    }
  };

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
          insc =>
            insc &&
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

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 my-6">
      <p>{error}</p>
    </div>
  );

  // Filtrar las competencias según el término de búsqueda
  const filteredInscripciones = Object.entries(inscripcionesAgrupadas).reduce((acc, [disciplina, grupos]) => {
    const filteredGrupos = grupos.filter(grupo =>
      grupo.competencia.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredGrupos.length > 0) {
      acc[disciplina] = filteredGrupos;
    }

    return acc;
  }, {});

  return (
    <div className="container mx-auto py-8 w-5/6">
      <div className="p-6 md:w-11/12 lg:w-5/6 mx-auto poppins">
        <div className="flex items-center justify-center">
          <img src={trofeo} alt="trofeo" className="lg:w-1/12 md:w-2/12 w-3/12 mr-1" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold lg:mt-12 md:mt-12 mt-3 text-start">Mis Competencias</h1>
        </div>

        {/* Barra de búsqueda */}
        <div>
          <div className="flex justify-center mt-6 text-black">
            <input
              type="text"
              placeholder="Buscar Competencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-4/6 lg:3/6"
            />
          </div>
        </div>
      </div>

      {searchTerm && Object.keys(filteredInscripciones).length === 0 ? (
        <h1 className="text-center text-3xl font-bold text-red-500 mt-12 mb-12">No se encontraron competencias</h1>
      ) : (
        Object.entries(filteredInscripciones).map(([disciplina, grupos]) => {
          const { bgClass, textClass } = getDisciplinaStyles(disciplina);

          return (
            <div key={disciplina}>
              <h1 className={`text-4xl mt-5 font-bold ${textClass}`}>{disciplina}</h1>
              <div className="w-8/12 md:w-5/12 lg:w-3/12 h-1 bg-primary-0 mb-5"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {grupos.map((grupo, index) => {
                  return (
                    <div
                      key={index}
                      className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${bgClass}`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2">
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

                        <div className="p-3 mt-3 w-full text-center lg:text-left">
                          <h2 className="text-xl font-bold text-gray-800">
                            {grupo.competencia.Nombre || "Competencia no especificada"}
                          </h2>
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
                            <button
                              onClick={async () => {
                                try {
                                  const resultados = await fetchResultadosCompetencia(grupo.competencia._id);
                                  setCompetenciaResultados({
                                    competencia: grupo.competencia,
                                    resultados
                                  });
                                } catch (err) {
                                  setError("Error al cargar los resultados");
                                }
                              }}
                              className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold py-1 px-3 rounded-lg transition hover:scale-105 duration-200"
                            >
                              Mostrar resultados
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Modal para mostrar las pruebas */}
      {modalOpen && (
        <div className="text-black fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-5/6 lg:w-1/3">
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

{competenciaResultados && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="w-full max-w-4xl max-h-[90vh] rounded-lg bg-white shadow-lg overflow-y-auto">
      <div className="flex items-center p-4 border-b bg-[#6b4c8f] text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">
          Resultados: {competenciaResultados.competencia.Nombre}
        </h2>
        <button 
          onClick={() => setCompetenciaResultados(null)} 
          className="ml-auto text-2xl font-bold text-slate-200 hover:text-slate-400"
        >
          &times;
        </button>
      </div>
      
      <div className="p-4">
        {Object.keys(competenciaResultados.resultados).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(competenciaResultados.resultados).map(([pruebaId, {nombre, resultados}]) => (
              <div key={pruebaId} className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-black">{nombre}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-center">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Atleta</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center text-black">
                      {resultados.map((resultado) => (
                        <tr key={resultado._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{resultado.Posicion}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {resultado.Atleta?.Nombre_Apellido || 'Atleta desconocido'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{resultado.Marca}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay resultados registrados para esta competencia.</p>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MisCompetencias;
