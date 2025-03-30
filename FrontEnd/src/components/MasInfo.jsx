import React, { useState, useEffect } from 'react';
import { api } from '../service/apiService';
import { ModalCustom } from '../components/ModalCustom';

const MasInfo = ({ isOpen, onClose, competencia }) => {
  const [pruebas, setPruebas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && competencia?._id) {
      fetchPruebas();
    }
  }, [isOpen, competencia]);

  const fetchPruebas = async () => {
    try {
      setLoading(true);
      const response = await api.prueba.getByCompetencia(competencia._id);
      
      // Ordenar pruebas por nombre
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

  if (!isOpen) return null;

  return (
    <ModalCustom
      title={`Pruebas de ${competencia?.Nombre || 'Competencia'}`}
      type="info" // Cambiado a tipo 'info' en lugar de 'form'
      onClose={onClose}
      showConfirmButton={false} // No mostrar botón de confirmar
      cancelText="Cerrar"
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
            </div>
          ) : pruebas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay pruebas disponibles para esta competencia</p>
          ) : (
            <ul className="space-y-3">
              {pruebas.map(prueba => (
                <li key={prueba._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {prueba.Nombre}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Disciplina:</span> {prueba.Disciplina}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Estilo:</span> {prueba.Estilo}
                      </div>
                      {prueba.Categoria && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Categoría:</span> {prueba.Categoria}
                        </div>
                      )}
                    </div>
                    {prueba.Distancia && (
                      <div className="text-right">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {prueba.Distancia}m
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ModalCustom>
  );
};

export default MasInfo;