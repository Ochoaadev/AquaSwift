import React, { useState } from "react";
import { useUpItemsContext } from "../contexts/UpProvider";
import { useLocation } from "react-router-dom";

const AgregarCompetencia = () => {
  const location = useLocation();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [categoria, setCategoria] = useState("");
  const [genero, setGenero] = useState("");
  const [Imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { fetchData } = useUpItemsContext();

  // Determinar la disciplina según la ruta
  let disciplinaFija = "";
  if (location.pathname === "/natacion") disciplinaFija = "Natacion";
  else if (location.pathname === "/acuatlon") disciplinaFija = "Acuatlon";
  else if (location.pathname === "/triatlon") disciplinaFija = "Triatlon";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Fecha", fecha);
    formData.append("Disciplina", disciplinaFija || disciplina);
    formData.append("Categoria", categoria);
    formData.append("Genero", genero);
    if (Imagen) {
      formData.append("Imagen", Imagen);
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
      setModalOpen(false);

      setNombre("");
      setFecha("");
      setDisciplina("");
      setCategoria("");
      setGenero("");
      setImagen(null);
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
          className="bg-gradient-to-r from-[#1E40AF] to-[#9333EA] text-2xl md:text-2xl lg:text-3xl font-bold py-2 px-4 rounded-lg"
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

              {/* Select de Disciplina */}
              <select
                value={disciplinaFija || disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white"
                required
                disabled={!!disciplinaFija} // Deshabilitar si hay una disciplina fija
              >
                <option value="">Seleccione Disciplina</option>
                <option value="Natacion">Natación</option>
                <option value="Acuatlon">Acuatlón</option>
                <option value="Triatlon">Triatlón</option>
              </select>

              <input
                type="text"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 border rounded-xl"
                required
              />
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
              {error && <p className="text-green-700 text-center">{error}</p>}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700"
                >
                  {loading ? "Creando..." : "Crear"}
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
