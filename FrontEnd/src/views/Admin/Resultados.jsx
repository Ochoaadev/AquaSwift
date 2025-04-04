import React, { useState, useEffect } from "react";
import { useItemsContext, useUpItemsContext } from "../../contexts/UpProvider";
import { api } from "../../service/apiService";
import equipo from "/equipo.png";

const ResultadosCompetencias = () => {
  const { items } = useItemsContext();
  const { fetchData } = useUpItemsContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompetencia, setSelectedCompetencia] = useState(null);
  const [editingResultado, setEditingResultado] = useState(null);

  return (
    <div className="p-6 md:w-11/12 lg:w-5/6 mx-auto poppins">
      <div className="flex items-center justify-center">
        <img src={equipo} alt="equipo" className="lg:w-1/12 md:w-2/12 w-4/12 mr-4" />
        <h1 className="text-3xl lg:text-5xl font-bold lg:mt-12 mt-7 text-center">Resultados por Competencia</h1>
      </div>

      <div className="flex justify-center items-center mt-5">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r text-3xl  from-[#1E40AF] to-[#9333EA] text-white font-bold transition hover:scale-105 duration-200 py-2 px-4 rounded-xl"
              >
                + Agregar Resultados
              </button>  
      </div>

      {["Natacion", "Acuatlon", "Triatlon"].map((disciplina, index) => {
        const colorClasses = ["text-primary-100", "text-primary-300", "text-primary-400"];
        const bgColorClasses = ["bg-primary-150", "bg-primary-300", "bg-primary-450"];
        const competencias = items.filter((comp) => comp.Disciplina === disciplina);

        return (
          <div key={disciplina}>
            <h1 className={`text-4xl mt-5 font-bold ${colorClasses[index]}`}>{disciplina}</h1>
            <div className="w-8/12 md:w-5/12 lg:w-3/12 h-1 bg-primary-0 mb-5"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
              {competencias.map((competencia) => (
                <CompetenciaResultadosCard
                key={competencia._id}
                competencia={competencia}
                bgColorClass={bgColorClasses[index]}
                onViewResults={() => setSelectedCompetencia(competencia)}
                onAddResults={() => setShowAddModal(true)} 
              />              
              ))}
            </div>
          </div>
        );
      })}

      {showAddModal && (
        <ResultadosAddModal
          onClose={() => setShowAddModal(false)}
          onResultAdded={() => {
            setShowAddModal(false);
            if (selectedCompetencia) {
              setSelectedCompetencia(null);
              setTimeout(() => setSelectedCompetencia(selectedCompetencia), 100);
            }
          }}
        />
      )}

      {selectedCompetencia && (
        <ResultadosViewModal
          competencia={selectedCompetencia}
          onClose={() => setSelectedCompetencia(null)}
          onEditResultado={setEditingResultado}
        />
      )}

      {editingResultado && (
        <EditarResultadoModal
          resultado={editingResultado}
          onClose={() => setEditingResultado(null)}
          onUpdate={() => {
            setEditingResultado(null);
            setSelectedCompetencia(null);
            setTimeout(() => setSelectedCompetencia(selectedCompetencia), 100);
          }}
        />
      )}
    </div>
  );
};

const CompetenciaResultadosCard = ({ competencia, bgColorClass, onViewResults, onAddResults  }) => {
  return (
    <div className={`${bgColorClass} rounded-xl p-5 flex flex-col lg:flex-row justify-start items-center gap-5 transition hover:scale-105 duration-200`}>
      <img
        src={competencia.Imagen?.url}
        alt={competencia.Nombre}
        className="h-48 w-72 rounded-lg mx-auto lg:mx-0 sm:w-64 md:w-72 lg:w-90 lg:h-56"
      />

      <div className="grid justify-center items-center -mt-4 md:-mt-4 lg:mt-0">
        <div>
          <h4 className="text-2xl font-semibold text-center lg:text-left">{competencia.Nombre}</h4>
          <p className="text-lg text-center lg:text-left"><span className="font-bold">Categoría: </span>{competencia.Categoria.map((cat) => cat.Nombre).join(", ")}</p>
          <p className="text-lg text-center lg:text-left">
            <span className="font-bold">Fecha: </span>
            {new Date(competencia.Fecha).toLocaleDateString()}
          </p>
          <p className="text-lg text-center lg:text-left"><span className="font-bold">Género: </span>{competencia.Genero}</p>
          
          
          <div className="grid grid-cols-1 lg:justify-start mt-2">

            <button 
              onClick={onViewResults}
              className="w-full bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold transition hover:scale-105 duration-200 py-1 px-3 rounded-xl"
            >
              Ver Resultados
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

const ResultadosViewModal = ({ competencia, onClose, onEditResultado }) => {
  const [resultadosAgrupados, setResultadosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resultadoToDelete, setResultadoToDelete] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        setLoading(true);
        const response = await api.resultado.getByCompetencia(competencia._id);
        
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
          
          setResultadosAgrupados(resultadosProcesados);
        } else {
          setResultadosAgrupados({});
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al obtener resultados:', err);
        setError(err.message || 'Error al cargar resultados');
        setResultadosAgrupados({});
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [competencia._id]);

  // Función para convertir tiempo a segundos
  const convertirTiempoASegundos = (tiempo) => {
    if (!tiempo) return Infinity; // Usar Infinity para que los tiempos vacíos aparezcan al final
    
    const partes = tiempo.split(':').map(part => parseFloat(part) || 0);
    
    if (partes.length === 3) {
      return partes[0] * 3600 + partes[1] * 60 + partes[2];
    } else if (partes.length === 2) {
      return partes[0] * 60 + partes[1];
    } else {
      return partes[0];
    }
  };

  const handleDeleteResultado = async (resultadoId) => {
    try {
      setLoading(true);
      await api.resultado.delete(resultadoId);
      
      const response = await api.resultado.getByCompetencia(competencia._id);
      
      let resultadosActualizados = [];
      if (response && typeof response === 'object') {
        resultadosActualizados = Object.values(response).flatMap(pruebaData => 
          pruebaData.resultados.map(resultado => ({
            ...resultado,
            Prueba: pruebaData.Prueba
          }))
        );
      }
      
      setResultados(resultadosActualizados);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setResultadoToDelete(null);
    }
  };

  const confirmDelete = (resultadoId) => {
    setResultadoToDelete(resultadoId);
    setShowDeleteModal(true);
  };

  const handleExport = async (format) => {
    try {
      setExporting(format);
      setExportError(null);
      
      // Cambiar la forma en que manejamos la respuesta
      const response = await api.export[format](competencia._id, null, {
        responseType: format === 'pdf' ? 'blob' : 'arraybuffer'
      });
  
      // Crear el blob según el tipo de archivo
      const blob = new Blob([response], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
  
      // Crear el enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resultados_${competencia.Nombre}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
  
    } catch (err) {
      console.error(`Error al exportar a ${format}:`, err);
      setExportError(`Error al exportar a ${format}: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity" onClick={onClose}>
      <div 
        className="w-full max-w-6xl max-h-[90vh] rounded-lg bg-white text-black shadow-lg transition-all overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b bg-[#6b4c8f] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Resultados: {competencia.Nombre}</h2>
          <button 
            onClick={onClose} 
            className="ml-auto text-2xl font-bold text-slate-200 hover:text-slate-400" 
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          {/* Botones de exportación */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => handleExport('excel')}
              disabled={exporting || loading}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
            >
              {exporting === 'excel' ? 'Exportando...' : 'Excel'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting || loading}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
            >
              {exporting === 'pdf' ? 'Exportando...' : 'PDF'}
            </button>
          </div>

          {exportError && <div className="text-red-500 mb-4">{exportError}</div>}
          {loading && <div className="text-center py-4">Cargando resultados...</div>}
          {error && <div className="text-red-500 mb-4">Error: {error}</div>}

          {!loading && Object.keys(resultadosAgrupados).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(resultadosAgrupados).map(([pruebaId, {nombre, resultados}]) => (
                <div key={pruebaId} className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{nombre}</h3>
                  <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-center">
                          <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Atleta</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-center">
                          {resultados.map((resultado) => (
                            <tr key={resultado._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{resultado.Posicion}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {resultado.Atleta?.Nombre_Apellido || 'Atleta desconocido'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{resultado.Marca}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(resultado.FechaRegistro).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-center gap-3">
                                  <button
                                    onClick={() => onEditResultado(resultado)}
                                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(resultado._id)}
                                    className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="text-gray-600">No hay resultados registrados para esta competencia.</p>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div 
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
              <p className="mb-6">¿Está seguro que desea eliminar este resultado? Esta acción no se puede deshacer.</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setResultadoToDelete(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteResultado(resultadoToDelete)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EditarResultadoModal = ({ resultado, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    Marca: resultado.Marca,
    Posicion: resultado.Posicion || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener nombre de prueba y atleta de manera segura
  const nombrePrueba = resultado.Prueba?.Nombre || 
                      (typeof resultado.Prueba === 'string' ? resultado.Prueba : 'Prueba desconocida');
  
  const nombreAtleta = resultado.Atleta?.Nombre_Apellido || 
                      (typeof resultado.Atleta === 'string' ? resultado.Atleta : 'Atleta desconocido');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.resultado.update(resultado._id, formData);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity">
      <div className="w-full max-w-md rounded-lg bg-white text-black shadow-lg transition-all overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center p-4 border-b bg-[#6b4c8f] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Editar Resultado</h2>
          <button onClick={onClose} className="ml-auto text-2xl font-bold text-slate-200 hover:text-slate-400" aria-label="Cerrar">
            &times;
          </button>
        </div>
        
        <div className="p-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Atleta:</label>
              <input
                type="text"
                value={nombreAtleta}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Prueba:</label>
              <input
                type="text"
                value={nombrePrueba}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Tiempo:</label>
              <input
                type="text"
                name="Marca"
                value={formData.Marca}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Posición:</label>
              <input
                type="number"
                value={formData.Posicion}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#6b4c8f] text-white rounded hover:bg-[#6b4c8f]/80 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ResultadosAddModal = ({ onClose, onResultAdded }) => {
  const [formData, setFormData] = useState({
    competenciaId: '',
    Prueba: '',
    Atleta: '',
    Marca: '',
  });
  const [competencias, setCompetencias] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetencias = async () => {
      try {
        setLoading(true);
        const data = await api.competencia.getAll();
        setCompetencias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetencias();
  }, []);

  useEffect(() => {
    if (!formData.competenciaId) return;

    const fetchPruebas = async () => {
      try {
        setLoading(true);
        const data = await api.prueba.getByCompetencia(formData.competenciaId);
        setPruebas(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPruebas();
  }, [formData.competenciaId]);

  useEffect(() => {
    if (!formData.Prueba || !formData.competenciaId) return;

    const fetchAtletas = async () => {
      try {
        setLoading(true);
        const inscripciones = await api.inscripcion.getByCompetencia(formData.competenciaId);
        const atletasInscritos = inscripciones
          .filter(insc => insc.Prueba._id.toString() === formData.Prueba)
          .map(insc => ({
            _id: insc.Atleta._id || insc.Atleta,
            Nombre: insc.Atleta.Nombre_Apellido?.split(' ')[0] || 'Nombre no disponible',
            Apellido: insc.Atleta.Nombre_Apellido?.split(' ')[1] || 'Apellido no disponible'
          }));
        setAtletas(atletasInscritos);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAtletas();
  }, [formData.Prueba, formData.competenciaId]);

  // Función para formatear el tiempo según el tipo de prueba
  const formatTimeInput = (value, pruebaNombre) => {
    if (!value) return value;
    
    // Limpiar caracteres no numéricos excepto : y .
    let cleaned = value.replace(/[^\d:.]/g, '');
    
    // Si la prueba empieza con 50 (formato S.MS)
    if (pruebaNombre && pruebaNombre.startsWith('50')) {
      // Permitir solo un punto decimal
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }
      return cleaned;
    } 
    // Para otras pruebas (formato M:S.MS)
    else {
      // Permitir solo dos puntos (uno para minutos:segundos y otro para decimales)
      const parts = cleaned.split(':');
      if (parts.length > 2) {
        cleaned = parts.slice(0, 2).join(':') + ':' + parts.slice(2).join('');
      }
      
      // Dividir en minutos y segundos
      const timeParts = cleaned.split(':');
      if (timeParts.length > 1) {
        // Formatear segundos con máximo un punto decimal
        const secondsParts = timeParts[1].split('.');
        if (secondsParts.length > 2) {
          timeParts[1] = secondsParts[0] + '.' + secondsParts.slice(1).join('');
        }
        return timeParts[0] + ':' + timeParts[1];
      }
      return cleaned;
    }
  };

  // Obtener el nombre de la prueba seleccionada
  const pruebaSeleccionada = pruebas.find(p => p._id === formData.Prueba);
  const nombrePrueba = pruebaSeleccionada?.Nombre || '';

  const handleTimeChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatTimeInput(value, nombrePrueba);
    setFormData(prev => ({ ...prev, Marca: formattedValue }));
  };

  // Función para validar el formato del tiempo
  const validateTimeFormat = (time, pruebaNombre) => {
    if (!time) return false;
    
    if (pruebaNombre && pruebaNombre.startsWith('50')) {
      // Validar formato S.MS (ej. 23.45)
      return /^\d{1,2}(\.\d{1,2})?$/.test(time);
    } else {
      // Validar formato M:S.MS (ej. 1:23.45)
      return /^\d{1,2}:\d{1,2}(\.\d{1,2})?$/.test(time);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Primero crear el resultado con posición 0
      const nuevoResultado = await api.resultado.create(
        formData.competenciaId,
        {
          Prueba: formData.Prueba,
          Atleta: formData.Atleta,
          Marca: formData.Marca,
          Posicion: 0
        }
      );

      // Obtener todos los resultados de la prueba para recalcular posiciones
      const response = await api.resultado.getByCompetencia(formData.competenciaId);
      if (response && typeof response === 'object') {
        const pruebaData = Object.values(response).find(p => p.Prueba._id === formData.Prueba);
        if (pruebaData) {
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

          // Actualizar todas las posiciones
          await Promise.all(resultadosOrdenados.map(async (resultado) => {
            await api.resultado.update(resultado._id, {
              Posicion: resultado.Posicion
            });
          }));
        }
      }
      
      setError(null);
      onResultAdded();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity" onClick={onClose}>
      <div 
        className="w-full max-w-4xl max-h-[90vh] rounded-lg bg-white text-black shadow-lg transition-all overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b bg-[#6b4c8f] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Agregar Nuevos Resultados</h2>
          <button 
            onClick={onClose} 
            className="ml-auto text-2xl font-bold text-slate-200 hover:text-slate-400" 
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium">Competencia:</label>
                <select
                  name="competenciaId"
                  value={formData.competenciaId}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccionar competencia</option>
                  {competencias.map(competencia => (
                    <option key={competencia._id} value={competencia._id}>
                      {competencia.Nombre} - {new Date(competencia.Fecha).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Prueba:</label>
                <select
                  name="Prueba"
                  value={formData.Prueba}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !formData.competenciaId}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccionar prueba</option>
                  {pruebas.map(prueba => (
                    <option key={prueba._id} value={prueba._id}>
                      {prueba.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Atleta:</label>
                <select
                  name="Atleta"
                  value={formData.Atleta}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !formData.Prueba}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccionar atleta</option>
                  {atletas.map(atleta => (
                    <option key={atleta._id} value={atleta._id}>
                      {atleta.Nombre} {atleta.Apellido}
                    </option>
                  ))}
                </select>
              </div>


              <div>
              <label className="block mb-2 font-medium">Tiempo:</label>
              <input
                type="text"
                name="Marca"
                value={formData.Marca}
                onChange={handleTimeChange}
                required
                disabled={loading}
                className="w-full p-2 border rounded"
                placeholder={
                  nombrePrueba && nombrePrueba.startsWith('50') 
                    ? "Ej: 23.45 (segundos.milisegundos)" 
                    : "Ej: 1:23.45 (minutos:segundos.milisegundos)"
                }
              />
              {formData.Marca && !validateTimeFormat(formData.Marca, nombrePrueba) && (
                <p className="text-red-500 text-sm mt-1">
                  Formato inválido. Use {nombrePrueba.startsWith('50') 
                    ? "(ej. 23.45)" 
                    : "(ej. 1:23.45)"}
                </p>
              )}
            </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.Atleta}
                className="px-4 py-2 bg-[#6b4c8f] text-white rounded hover:bg-[#6b4c8f]/80 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Resultado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResultadosCompetencias;