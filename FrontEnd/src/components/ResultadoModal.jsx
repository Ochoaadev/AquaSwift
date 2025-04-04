import React, { useState, useEffect } from "react";

export function ResultadosModal({
    isOpen,
    onClose,
    competenciaId,
    resultados = [],
    onDeleteResultado,
    loading = false,
    title = "Gestión de Resultados",
    type = "form"
  }) {
    const [pruebas, setPruebas] = useState([]);
    const [inscripciones, setInscripciones] = useState([]);
    const [formData, setFormData] = useState({
      Prueba: '',
      Atleta: '',
      Posicion: '',
      Marca: '',
      Puntos: ''
    });
    const [error, setError] = useState(null);
  
    // Cargar datos necesarios para el formulario
    useEffect(() => {
      if (!isOpen || !competenciaId) return;
  
      const loadData = async () => {
        try {
          const [pruebasData, inscripcionesData] = await Promise.all([
            api.prueba.getByCompetencia(competenciaId),
            api.inscripcion.getByCompetencia(competenciaId)
          ]);
          
          setPruebas(pruebasData);
          setInscripciones(inscripcionesData);
        } catch (err) {
          setError(err.message);
        }
      };
  
      loadData();
    }, [isOpen, competenciaId]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const getAtletasInscritosEnPrueba = (pruebaId) => {
      if (!pruebaId) return [];
      
      return inscripciones
        .filter(insc => insc.Prueba._id.toString() === pruebaId)
        .map(insc => ({
          _id: insc.Atleta._id || insc.Atleta,
          Nombre: insc.Atleta.Nombre_Apellido?.split(' ')[0] || 'Nombre no disponible',
          Apellido: insc.Atleta.Nombre_Apellido?.split(' ')[1] || 'Apellido no disponible'
        }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        await api.resultado.create(
          competenciaId,
          {
            ...formData,
            Puntos: formData.Puntos || 0
          }
        );
        
        // Recargar resultados (manejado por el componente padre)
        setFormData({
          Prueba: '',
          Atleta: '',
          Posicion: '',
          Marca: '',
          Puntos: ''
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity" onClick={onClose}>
        <div 
          className="w-full max-w-4xl max-h-[90vh] rounded-lg bg-white text-black shadow-lg transition-all overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center p-4 border-b bg-[#6b4c8f] text-white rounded-t-lg`}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <button 
              onClick={onClose} 
              className="ml-auto text-2xl font-bold text-slate-200 hover:text-slate-400" 
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
          
          <div className="p-4">
            {loading && <div className="text-center py-4">Cargando...</div>}
            {error && <div className="text-red-500 mb-4">Error: {error}</div>}
  
            <h3 className="text-lg font-semibold mb-4">Registrar Nuevo Resultado</h3>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 font-medium">Prueba:</label>
                  <select 
                    name="Prueba" 
                    value={formData.Prueba} 
                    onChange={handleInputChange}
                    required
                    disabled={loading}
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
                    {getAtletasInscritosEnPrueba(formData.Prueba).map(atleta => (
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
  
              <button 
                type="submit" 
                disabled={loading || !formData.Atleta}
                className="px-4 py-2 bg-[#6b4c8f] text-white rounded hover:bg-[#6b4c8f]/80 disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrar Resultado'}
              </button>
            </form>
  
            <h3 className="text-lg font-semibold mb-4">Resultados Registrados</h3>
            {resultados.length > 0 ? (
              <div className="space-y-6">
                {resultados.map(grupo => (
                  <div key={grupo.Prueba._id} className="mb-6">
                    <h4 className="font-medium text-lg mb-2">{grupo.Prueba.Nombre}</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border">Posición</th>
                            <th className="p-2 border">Atleta</th>
                            <th className="p-2 border">Marca</th>
                            <th className="p-2 border">Puntos</th>
                            <th className="p-2 border">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.resultados.map(resultado => (
                            <tr key={resultado._id} className="hover:bg-gray-50">
                              <td className="p-2 border text-center">{resultado.Posicion}</td>
                              <td className="p-2 border">
                                {resultado.Atleta.Nombre} {resultado.Atleta.Apellido}
                              </td>
                              <td className="p-2 border text-center">{resultado.Marca}</td>
                              <td className="p-2 border text-center">{resultado.Puntos}</td>
                              <td className="p-2 border text-center">
                                <button 
                                  onClick={() => onDeleteResultado(resultado._id)}
                                  disabled={loading}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  Eliminar
                                </button>
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
              <p className="text-gray-600">No hay resultados registrados para esta competencia.</p>
            )}
          </div>
        </div>
      </div>
    );
  }