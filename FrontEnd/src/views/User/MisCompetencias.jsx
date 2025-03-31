import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { api } from "../../service/apiService";
import { useNavigate } from "react-router-dom";

const MisCompetencias = () => {
  const { user } = useContext(AuthContext);
  const [inscripcionesAgrupadas, setInscripcionesAgrupadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        setInscripcionesAgrupadas(Object.values(agrupadas));
      } catch (err) {
        console.error("Error al obtener inscripciones:", err);
        setError("Error al cargar tus competencias");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const getTipoCompetencia = (disciplina) => {
    if (!disciplina) return "No especificado";
    
    switch(disciplina.toLowerCase()) {
      case 'natacion':
        return 'Natación';
      case 'acuatlon':
        return 'Acuatlón';
      case 'triatlon':
        return 'Triatlón';
      default:
        return disciplina;
    }
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mis Competencias</h1>
      
      {inscripcionesAgrupadas.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <p>No tienes inscripciones activas en este momento.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {inscripcionesAgrupadas.map((grupo, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Sección de imagen */}
                <div className="md:w-1/3 p-4 flex justify-center">
                  <img
                    src={grupo.competencia.Imagen.url || "/default-competition.jpg"}
                    alt={grupo.competencia.Nombre}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/default-competition.jpg";
                    }}
                  />
                </div>
                
                {/* Sección de información */}
                <div className="md:w-2/3 p-6">
                  {/* Encabezado con nombre de competencia */}
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {grupo.competencia.Nombre || "Competencia no especificada"}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {getTipoCompetencia(grupo.competencia.Disciplina)}
                    </span>
                  </div>
                  
                  {/* Detalles de la inscripción */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pruebas inscritas:</p>
                      <ul className="list-disc list-inside text-gray-800">
                        {grupo.pruebas.map((prueba, i) => (
                          <li key={i}>{prueba.Nombre}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de inscripción:</p>
                      <p className="text-gray-800">
                        {grupo.fechaInscripcion 
                          ? new Date(grupo.fechaInscripcion).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            }) 
                          : "Fecha no disponible"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha competencia:</p>
                      <p className="text-gray-800">
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
                  
                  <div className="flex justify-end mt-4">
                    <button 
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      disabled
                      title="Funcionalidad próximamente disponible"
                    >
                      Mostrar resultados
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCompetencias;