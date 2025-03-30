import React, { useState, useEffect } from 'react';
import { api } from '../service/apiService';
import {ModalCustom} from '../components/ModalCustom';

const Inscripcion = ({ isOpen, onClose, competencia }) => {
  const [pruebas, setPruebas] = useState([]);
  const [selectedPruebas, setSelectedPruebas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const userId = localStorage.getItem('_id');

  useEffect(() => {
    if (isOpen && competencia?._id) {
      fetchPruebas();
      fetchInscripcionesExistentes();
    }
  }, [isOpen, competencia]);

  const fetchPruebas = async () => {
    try {
      const response = await api.prueba.getByCompetencia(competencia._id);
      setPruebas(response);
    } catch (err) {
      setError('Error al cargar las pruebas disponibles');
      console.error(err);
    }
  };

  const fetchInscripcionesExistentes = async () => {
    try {
      const inscripciones = await api.inscripcion.getByAtleta(userId);
      const pruebasInscritas = inscripciones
        .filter(i => i.Competencia._id === competencia._id)
        .map(i => i.Prueba._id);
      
      setSelectedPruebas(pruebasInscritas);
    } catch (err) {
      console.error('Error al verificar inscripciones existentes:', err);
    }
  };

  const handlePruebaSelection = (pruebaId) => {
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
          {pruebas.length === 0 ? (
            <p className="text-gray-500">No hay pruebas disponibles para esta competencia</p>
          ) : (
            <ul className="space-y-2">
              {pruebas.map(prueba => (
                <li key={prueba._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`prueba-${prueba._id}`}
                    checked={selectedPruebas.includes(prueba._id)}
                    onChange={() => handlePruebaSelection(prueba._id)}
                    className="mr-2 h-5 w-5 text-primary-100 rounded focus:ring-primary-100"
                    disabled={selectedPruebas.includes(prueba._id) && 
                              selectedPruebas.findIndex(id => id === prueba._id) < 
                              pruebas.length - (pruebas.length - selectedPruebas.length)}
                  />
                  <label htmlFor={`prueba-${prueba._id}`} className="text-gray-700">
                    {prueba.Nombre} ({prueba.Genero})
                    {selectedPruebas.includes(prueba._id) && (
                      <span className="ml-2 text-green-500 text-sm">✓ Inscrito</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ModalCustom>
  );
};

export default Inscripcion;