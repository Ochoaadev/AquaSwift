import React, { useState } from "react";
import { useItemsContext } from "../../contexts/UpProvider";
import {api} from '../../service/apiService'
import equipo from "/equipo.png";

const ResultCompet = () => {
  const { items } = useItemsContext();
  const [selectedCompetencia, setSelectedCompetencia] = useState(null);

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
                />
              ))}
            </div>
          </div>
        );
      })}

      {selectedCompetencia && (
        <ResultadosViewModal
          competencia={selectedCompetencia}
          onClose={() => setSelectedCompetencia(null)}
        />
      )}
    </div>
  );
};

const CompetenciaResultadosCard = ({ competencia, bgColorClass, onViewResults }) => {
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
              + Resultados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultadosViewModal = ({ competencia, onClose }) => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
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
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="text-gray-600">No hay resultados registrados para esta competencia.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCompet;