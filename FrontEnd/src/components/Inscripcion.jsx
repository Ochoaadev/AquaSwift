import React, { useState, useEffect } from 'react';
import { api } from '../service/apiService';
import {ModalCustom} from '../components/ModalCustom';

const Inscripcion = ({ isOpen, onClose, competencia }) => {
  const [pruebas, setPruebas] = useState([]);
  const [selectedPruebas, setSelectedPruebas] = useState([]);
  const [pruebasInscritas, setPruebasInscritas] = useState([]); // Nuevo estado para pruebas ya 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const userId = localStorage.getItem('_id');

  useEffect(() => {
    if (isOpen && competencia?._id && userId) {
      fetchPruebas();
      fetchInscripcionesExistentes();
    } else {
      setSelectedPruebas([]);
    }
  }, [isOpen, competencia, userId]);

  const fetchPruebas = async () => {
    try {
      setLoading(true);
      const response = await api.prueba.getByCompetencia(competencia._id);
      
      // Ordenar pruebas por nombre o categoría si es necesario
      const pruebasOrdenadas = response.sort((a, b) => 
        a.Nombre.localeCompare(b.Nombre)
      );
      
      setPruebas(pruebasOrdenadas);
      setError(null);
    } catch (err) {
      setError('Error al cargar las pruebas disponibles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInscripcionesExistentes = async () => {
    try {
      const inscripciones = await api.inscripcion.getByAtleta(userId);
      const pruebasInscritas = inscripciones
        .filter(i => i?.Competencia?._id === competencia?._id)
        .map(i => i?.Prueba?._id)
        .filter(id => id != null);
      
      setPruebasInscritas(pruebasInscritas); // Almacenamos las pruebas ya inscritas
      setSelectedPruebas([]); // Limpiamos las seleccionadas
    } catch (err) {
      console.error('Error al verificar inscripciones existentes:', err);
      setPruebasInscritas([]);
    }
  };

  const handlePruebaSelection = (pruebaId) => {
    // No permitir cambiar pruebas ya inscritas
    if (pruebasInscritas.includes(pruebaId)) return;
    
    setSelectedPruebas(prev => {
      if (prev.includes(pruebaId)) {
        return prev.filter(id => id !== pruebaId);
      } else {
        return [...prev, pruebaId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedPruebas.length === 0) {
      setError('Debes seleccionar al menos una prueba');
      return;
    }

    if (selectedPruebas.length > 4) {
      setError('No puedes inscribirte en más de 4 pruebas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear una inscripción por cada prueba seleccionada
      const promises = selectedPruebas.map(pruebaId => 
        api.inscripcion.create({
          Atleta: userId,
          Competencia: competencia._id,
          Prueba: pruebaId
        })
      );

      await Promise.all(promises);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar la inscripción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalCustom
      title={`Inscripción a ${competencia?.Nombre || 'Competencia'}`}
      type="form"
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText={loading ? 'Procesando...' : 'Confirmar Inscripción'}
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ¡Inscripción exitosa!
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded mb-2">
          Puedes seleccionar hasta 4 pruebas como máximo
        </div>

        <div className="text-right text-sm font-medium">
          Seleccionadas: {selectedPruebas.length}/4
        </div>
        
        <p className="text-gray-700 mb-4">
          Selecciona las pruebas en las que deseas participar:
        </p>

        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
            </div>
          ) : pruebas.length === 0 ? (
            <p className="text-gray-500">No hay pruebas disponibles para esta competencia</p>
          ) : (
            <ul className="space-y-2">
              {pruebas.map(prueba => {
                const estaInscrito = pruebasInscritas.includes(prueba._id);
                const estaSeleccionado = selectedPruebas.includes(prueba._id);
                const puedeSeleccionar = !estaInscrito && (estaSeleccionado || selectedPruebas.length < 4);
                
                return (
                  <li key={prueba._id} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`prueba-${prueba._id}`}
                      checked={estaInscrito || estaSeleccionado}
                      onChange={() => handlePruebaSelection(prueba._id)}
                      className={`mt-1 mr-2 h-5 w-5 rounded focus:ring-primary-100 ${
                        estaInscrito 
                          ? 'bg-gray-300 border-gray-400 cursor-not-allowed'
                          : 'text-primary-100'
                      }`}
                      disabled={!puedeSeleccionar || estaInscrito}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`prueba-${prueba._id}`} 
                        className={`block font-medium ${
                          estaInscrito ? 'text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {prueba.Nombre}
                      </label>
                      <div className="text-sm text-gray-500">
                        {prueba.Disciplina} • {prueba.Estilo}
                        {estaInscrito && (
                          <span className="ml-2 text-blue-500">✓ Ya inscrito</span>
                        )}
                        {!estaInscrito && estaSeleccionado && (
                          <span className="ml-2 text-green-500">✓ Seleccionada</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </ModalCustom>
  );
};

export default Inscripcion;