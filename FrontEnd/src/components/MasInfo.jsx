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

      // Ordenar pruebas por el número al inicio del nombre
      const pruebasOrdenadas = response.sort((a, b) => {
        const numeroA = parseInt(a.Nombre.split(' ')[0], 10); // Extraer el número del nombre
        const numeroB = parseInt(b.Nombre.split(' ')[0], 10);
        return numeroA - numeroB; // Ordenar de menor a mayor
      });

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

        <div className="max-h-96 overflow-y-auto ">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
            </div>
          ) : pruebas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay pruebas disponibles para esta competencia</p>
          ) : (
            <ul className="grid grid-cols-2 gap-1">
              {pruebas.map(prueba => (
                <li
                  key={prueba._id}
                  className="bg-gray-100 text-center py-2 px-3 rounded text-sm font-medium text-gray-800"
                >
                  {prueba.Nombre}
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
