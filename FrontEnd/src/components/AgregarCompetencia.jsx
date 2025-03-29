import React, { useState, useEffect } from "react";
import { useUpItemsContext, useCategoriasContext } from "../contexts/UpProvider";
import { useLocation } from "react-router-dom";

const pruebasNatacion = {
  "Libre": [
    "50 mts libre", "100 mts libre", "200 mts libre", "400 mts libre", "800 mts libre", "1500 mts libre"
  ],
  "Espalda": [
    "50 mts espalda", "100 mts espalda", "200 mts espalda"
  ],
  "Pecho": [
    "50 mts pecho", "100 mts pecho", "200 mts pecho"
  ],
  "Mariposa": [
    "50 mts fly", "100 mts fly", "200 mts fly"
  ],
  "Combinado": [
    "200 mts C.I", "400 mts C.I"
  ]
};

const pruebasAcuatlon = ["3 km", "5 km", "6 km", "8 km"];
const pruebasTriatlon = ["26 km", "52 km", "113 km"];



const AgregarCompetencia = () => {
  const location = useLocation();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [genero, setGenero] = useState("");
  const [imagen, setImagen] = useState(null);
  const [pruebas, setPruebas] = useState([]); // Estado para almacenar pruebas seleccionadas
  const [estilo, setEstilo] = useState(""); // Estado para manejar el estilo seleccionado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { fetchData } = useUpItemsContext();
  const { categorias, fetchCategorias } = useCategoriasContext();

  let disciplinaFija = "";
  if (location.pathname === "/natacion") disciplinaFija = "Natacion";
  else if (location.pathname === "/acuatlon") disciplinaFija = "Acuatlon";
  else if (location.pathname === "/triatlon") disciplinaFija = "Triatlon";

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.Modalidad === (disciplinaFija || disciplina)
  );

  useEffect(() => {
    if (disciplinaFija) {
      setDisciplina(disciplinaFija);
    }
  }, [disciplinaFija]);
  

  const limpiarFormulario = () => {
    setNombre("");
    setFecha("");
    setDisciplina("");
    setCategoriaId("");
    setGenero("");
    setImagen(null);
    setPruebas([]);
    setEstilo(""); // Limpiar el estilo seleccionado
    setError("");
    setModalOpen(false);
  };

  const handleCheckboxChange = (prueba) => {
    setPruebas((prev) =>
      prev.includes(prueba) ? prev.filter((p) => p !== prueba) : [...prev, prueba]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Fecha", fecha);
    formData.append("Disciplina", disciplinaFija || disciplina);
    formData.append("Categoria", categoriaId);
    formData.append("Genero", genero);
    
    // Asegurar que las pruebas se envíen correctamente
    pruebas.forEach((prueba) => {
      formData.append("Pruebas[]", prueba); // Enviar cada prueba como un campo separado
    });
  
    if (imagen) {
      formData.append("Imagen", imagen);
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/competencias", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear la competencia");
      }
  
      await fetchData();
      limpiarFormulario();
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
          onClick={() => setModalOpen(true)}
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
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded-xl"
                required
              />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2 border rounded-xl"
                required
              />

              <select
                value={disciplinaFija || disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white"
                required
                disabled={!!disciplinaFija}
              >
                <option value="">Seleccione Disciplina</option>
                <option value="Natacion">Natación</option>
                <option value="Acuatlon">Acuatlón</option>
                <option value="Triatlon">Triatlón</option>
              </select>

              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white"
                required
                disabled={!disciplinaFija && !disciplina}
              >
                <option value="">Seleccione una categoría</option>
                {categoriasFiltradas.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.Nombre}
                  </option>
                ))}
              </select>

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

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="w-full p-2 border rounded-xl"
                required
              />

              {/* Sección para selección de pruebas en natación */}
              {disciplina === "Natacion" && (
                <div className="w-full p-2 border rounded-xl">
                  <label htmlFor="estilo" className="block font-semibold">Selecciona el estilo:</label>
                  <select
                    id="estilo"
                    value={estilo}
                    onChange={(e) => setEstilo(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="">Seleccione un estilo</option>
                    {Object.keys(pruebasNatacion).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mostrar pruebas según el estilo seleccionado en Natación */}
{(disciplinaFija === "Natacion" || disciplina === "Natacion") && estilo && (
  <div className="border p-2 rounded-xl mt-4">
    <label className="block font-semibold">Selecciona las pruebas:</label>
    <div className="grid grid-cols-2 gap-2">
      {pruebasNatacion[estilo].map((prueba) => (
        <label key={prueba} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={prueba}
            checked={pruebas.includes(prueba)}
            onChange={() => handleCheckboxChange(prueba)}
          />
          <span className="text-primary-600">{prueba}</span>
        </label>
      ))}
    </div>
  </div>
)}

{/* Sección de pruebas para Acuatlón */}
{(disciplinaFija === "Acuatlon" || disciplina === "Acuatlon") && (
  <div className="border p-2 rounded-xl mt-4">
    <label className="block font-semibold">Selecciona las pruebas:</label>
    <div className="grid grid-cols-2 gap-2">
      {pruebasAcuatlon.map((prueba) => (
        <label key={prueba} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={prueba}
            checked={pruebas.includes(prueba)}
            onChange={() => handleCheckboxChange(prueba)}
          />
          <span className="text-primary-600">{prueba}</span>
        </label>
      ))}
    </div>
  </div>
)}

{/* Sección de pruebas para Triatlón */}
{(disciplinaFija === "Triatlon" || disciplina === "Triatlon") && (
  <div className="border p-2 rounded-xl mt-4">
    <label className="block font-semibold">Selecciona las pruebas:</label>
    <div className="grid grid-cols-2 gap-2">
      {pruebasTriatlon.map((prueba) => (
        <label key={prueba} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={prueba}
            checked={pruebas.includes(prueba)}
            onChange={() => handleCheckboxChange(prueba)}
          />
          <span className="text-primary-600">{prueba}</span>
        </label>
      ))}
    </div>
  </div>
)}


              {error && <p className="text-red-700 text-center">{error}</p>}

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={limpiarFormulario}
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
