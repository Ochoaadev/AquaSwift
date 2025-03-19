const MasInfo = ({ isOpen, onClose, pruebas }) => {
  if (!isOpen) return null;

  // Asegurarse de que 'pruebas' siempre sea un arreglo (vacío si no se pasó correctamente)
  const pruebasValidas = Array.isArray(pruebas) ? pruebas : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/6 lg:w-6/12 md:w-8/12 relative z-50">
        <h2 className="text-xl font-bold text-center">Pruebas Disponibles</h2>
        {/* Mostrar las pruebas */}
        <div className="mt-4">
          {pruebasValidas.length === 0 ? (
            <p className="text-center text-gray-500">No hay pruebas disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
              {pruebasValidas.map((prueba, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-2 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <span>{prueba}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-bold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default MasInfo;
