import React, { useState, useEffect } from "react";
import { useUpItemsContext, useCategoriasContext } from "../contexts/UpProvider";
import { useLocation } from "react-router-dom";

const AgregarCompetencia = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [genero, setGenero] = useState("");
  const [imagen, setImagen] = useState(null);
  const [pruebas, setPruebas] = useState([]); // Estado para almacenar las pruebas desde la DB
  const [pruebasSeleccionadas, setPruebasSeleccionadas] = useState([]); // Estado para las pruebas seleccionadas
  const [estilo, setEstilo] = useState(""); // Estado para manejar el estilo seleccionado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { fetchData } = useUpItemsContext();
  const { categorias, fetchCategorias } = useCategoriasContext();

  // Elimina la parte que asigna disciplina según la ruta

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.Modalidad === disciplina
  );

  useEffect(() => {
    if (!disciplina) return; // Si no hay disciplina seleccionada, no hace nada

    const fetchPruebas = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/pruebas?disciplina=${disciplina}`);
        const data = await response.json();

        // Filtrar las pruebas por la propiedad 'Disciplina'
        const pruebasFiltradas = data.filter(prueba => prueba.Disciplina === disciplina);
        setPruebas(pruebasFiltradas); // Guardar las pruebas filtradas en el estado
      } catch (error) {
        console.error("Error al obtener pruebas:", error);
        setError("Error al obtener pruebas");
      }
    };

    fetchPruebas();
  }, [disciplina]);

  // Filtrar pruebas por Estilo si la disciplina es Natación y el estilo es seleccionado
  const pruebasFiltradasPorEstilo = estilo
    ? pruebas.filter((prueba) => prueba.Estilo === estilo)
    : [];

  const limpiarFormulario = () => {
    setNombre("");
    setFecha("");
    setDisciplina("");
    setCategoriaId("");
    setGenero("");
    setImagen(null);
    setPruebasSeleccionadas([]);
    setEstilo(""); // Limpiar el estilo seleccionado
    setError("");
    setPruebas([]); // Limpiar las pruebas
  };

  const handleCheckboxChange = (prueba) => {
    setPruebasSeleccionadas((prev) => {
      if (prev.some(p => p._id === prueba._id)) {
        return prev.filter(p => p._id !== prueba._id);
      } else {
        return [...prev, prueba];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Fecha", fecha);
    formData.append("Disciplina", disciplina); // Usa directamente la disciplina seleccionada
    formData.append("Categoria", categoriaId);
    formData.append("Genero", genero);

    pruebasSeleccionadas.forEach((prueba) => {
      formData.append("Pruebas[]", prueba.Nombre); // Enviar solo el Nombre
    });

    if (imagen) {
      formData.append("Imagen", imagen);
    }

    try {
      const response = await fetch("http://localhost:4000/api/competencias", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la competencia");
      }

      await fetchData();
      limpiarFormulario(); // Limpiar el formulario después de un envío exitoso
      setModalOpen(false); // Cerrar el modal después de enviar
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto poppins">
      <div className="flex justify-center items-center">
        <button
          onClick={() => {
            setModalOpen(true);
            limpiarFormulario(); // Limpiar el formulario cada vez que se abre el modal
          }}
          className="bg-gradient-to-r transition hover:scale-105 duration-200 from-[#1E40AF] to-[#9333EA] text-2xl md:text-2xl lg:text-3xl font-bold py-2 px-4 rounded-lg"
        >
          + Agregar Competencia
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="w-96 bg-primary-400 p-6 rounded-lg shadow-lg text-primary-100">
            <h2 className="text-xl font-bold mb-4 text-center">Crear Nueva Competencia</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nombre */}
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded-xl"
                required
              />
              
              {/* Fecha */}
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2 border rounded-xl"
                required
              />

              {/* Disciplina */}
              <select
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white"
                required
              >
                <option value="">Seleccione Disciplina</option>
                <option value="Natacion">Natación</option>
                <option value="Acuatlon">Acuatlón</option>
                <option value="Triatlon">Triatlón</option>
              </select>

              {/* Categoría (Bloqueado hasta que se seleccione una Disciplina) */}
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white"
                required
              >
                <option value="">Seleccione una categoría</option>
                {categoriasFiltradas.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.Nombre}
                  </option>
                ))}
              </select>

              {/* Género */}
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white"
                required
              >
                <option value="">Seleccione Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Mixto">Mixto</option>
              </select>

              {/* Agregar Foto */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="w-full p-2 border rounded-xl"
                required
              />

              {/* Estilo (Solo para Natación) */}
              {disciplina === "Natacion" && (
                <select
                  value={estilo}
                  onChange={(e) => setEstilo(e.target.value)}
                  className="w-full p-2 border rounded-xl bg-white"
                  required
                >
                  <option value="">Seleccione Estilo</option>
                  <option value="Libre">Libre</option>
                  <option value="Espalda">Espalda</option>
                  <option value="Pecho">Pecho</option>
                  <option value="Fly">Fly</option>
                </select>
              )}

              {/* Seleccionar las pruebas */}
              <div className="border p-2 rounded-xl mt-4">
                <label className="block font-semibold">Selecciona las pruebas:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(disciplina === "Natacion" ? pruebasFiltradasPorEstilo : pruebas).map((prueba) => (
                    <label key={prueba._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={prueba._id}
                        checked={pruebasSeleccionadas.some(p => p._id === prueba._id)}
                        onChange={() => handleCheckboxChange(prueba)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-primary-600">{prueba.Nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-700 text-center">{error}</p>}

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    limpiarFormulario();
                    setModalOpen(false); // Cerrar modal al cancelar
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700"
                >
                  {loading ? "Guardando..." : "Guardar Competencia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarCompetencia;
