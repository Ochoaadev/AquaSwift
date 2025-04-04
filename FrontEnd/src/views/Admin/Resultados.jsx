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
                  onClick={() => onAddResults(true)}
                  className="w-full mb-2 bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-white font-bold transition hover:scale-105 duration-200 py-1 px-3 rounded-xl"
                >
                  Agregar Resultados
            </button>

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
  const [resultados, setResultados] = useState([]);
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
        
        let resultadosNormalizados = [];
        
        if (response && typeof response === 'object') {
          resultadosNormalizados = Object.values(response).flatMap(pruebaData => {
            return pruebaData.resultados.map(resultado => ({
              ...resultado,
              Prueba: pruebaData.Prueba
            }));
          });
        }

        setResultados(resultadosNormalizados);
        setError(null);
      } catch (err) {
        console.error('Error al obtener resultados:', err);
        setError(err.message || 'Error al cargar resultados');
        setResultados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [competencia._id]);

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
        className="w-full max-w-4xl max-h-[90vh] rounded-lg bg-white text-black shadow-lg transition-all overflow-y-auto"
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
              {exporting === 'excel' ? (
                'Exportando...'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Excel
                </>
              )}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting || loading}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
            >
              {exporting === 'pdf' ? (
                'Exportando...'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  PDF
                </>
              )}
            </button>
          </div>

          {exportError && <div className="text-red-500 mb-4">{exportError}</div>}
          {loading && <div className="text-center py-4">Cargando resultados...</div>}
          {error && <div className="text-red-500 mb-4">Error: {error}</div>}

          {!loading && resultados.length > 0 ? (
            <div className="space-y-6">
              {resultados.map((resultado) => (
                <div key={`${resultado._id}-${resultado.Prueba?._id}`} className="mb-4 p-4 border rounded-lg">
                  <h4 className="font-medium text-lg mb-2">
                    Prueba: {resultado.Prueba?.Nombre || 'Prueba desconocida'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-semibold">Atleta:</span> {resultado.Atleta?.Nombre_Apellido || 'Atleta desconocido'}</p>
                      <p><span className="font-semibold">Posición:</span> {resultado.Posicion}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Marca:</span> {resultado.Marca}</p>
                      <p><span className="font-semibold">Puntos:</span> {resultado.Puntos}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p><span className="font-semibold">Fecha Registro:</span> {new Date(resultado.FechaRegistro).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button 
                      onClick={() => onEditResultado(resultado)}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => confirmDelete(resultado._id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
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
    Posicion: resultado.Posicion,
    Marca: resultado.Marca,
    Puntos: resultado.Puntos
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      <div 
        className="w-full max-w-md rounded-lg bg-white text-black shadow-lg transition-all overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b bg-[#6b4c8f] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Editar Resultado</h2>
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
            <div className="mb-4">
              <label className="block mb-2 font-medium">Atleta:</label>
              <input
                type="text"
                value={resultado.Atleta?.Nombre_Apellido || 'Atleta desconocido'}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Prueba:</label>
              <input
                type="text"
                value={resultado.Prueba?.Nombre || 'Prueba desconocida'}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Posición:</label>
              <input
                type="number"
                name="Posicion"
                value={formData.Posicion}
                onChange={handleInputChange}
                min="1"
                required
                disabled={loading}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Marca:</label>
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
              <label className="block mb-2 font-medium">Puntos:</label>
              <input
                type="number"
                name="Puntos"
                value={formData.Puntos}
                onChange={handleInputChange}
                min="0"
                disabled={loading}
                className="w-full p-2 border rounded"
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
    Posicion: '',
    Marca: '',
    Puntos: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await api.resultado.create(
        formData.competenciaId,
        {
          Prueba: formData.Prueba,
          Atleta: formData.Atleta,
          Posicion: formData.Posicion,
          Marca: formData.Marca,
          Puntos: formData.Puntos || 0
        }
      );
      
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
                <label className="block mb-2 font-medium">Posición:</label>
                <input
                  type="number"
                  name="Posicion"
                  value={formData.Posicion}
                  onChange={handleInputChange}
                  min="1"
                  required
                  disabled={loading}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Marca:</label>
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

              <div>
                <label className="block mb-2 font-medium">Puntos (opcional):</label>
                <input
                  type="number"
                  name="Puntos"
                  value={formData.Puntos}
                  onChange={handleInputChange}
                  min="0"
                  disabled={loading}
                  className="w-full p-2 border rounded"
                />
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