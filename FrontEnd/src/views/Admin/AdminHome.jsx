import React, { useState, useContext } from "react";
import { useItemsContext, useUpItemsContext } from "../../contexts/UpProvider"; 

import equipo from "/equipo.png";

const AdminHome = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [categoria, setCategoria] = useState("");
  const [genero, setGenero] = useState("");
  const [Imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { items } = useItemsContext(); 
  const { fetchData } = useUpItemsContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("Nombre", nombre);
    formData.append("Fecha", fecha);
    formData.append("Disciplina", disciplina)
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
        throw new Error("Error al crear la competencia");
      }

      const data = await response.json();
      console.log("Competencia creada:", data);

      // Limpiar el formulario
      setNombre("");
      setFecha("");
      setDisciplina("");
      setCategoria("");
      setGenero("");
      setImagen(null);

      // Actualizar la lista de competencias
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      setError("Error al crear la competencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-5/6 mx-auto poppins">

      <div className="flex items-center">
            <img src={equipo} alt="Usuario" className="lg:w-1/12 md:w-2/12 w-4/12 mr-4" />
            <h1 className="lg:text-5xl md:text-5xl text-4xl font-bold  lg:mt-12 md:mt-12 mt-2">
                Competencias Disponibles
            </h1>
      </div>


    <div>
      {/* <h2>Crear Nueva Competencia</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Disciplina:</label>
            <input
              type="text"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Categoría:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Género:</label>
            <input
              type="text"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Competencia"}
          </button>
        </form> */}
      </div>

      {/* Listado Horizontal de Competencias */}
      <div className="mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items
          .filter((competencia) => competencia.Imagen)
          .map((competencia) => (
            <div
              key={competencia._id}
              className="bg-primary-300 rounded-xl p-5 flex justify-center items-center gap-5" 
            >
              <img
                src={competencia.Imagen?.url}
                alt={competencia.Nombre}
                className="w-6/12 rounded-lg mx-auto"
              />

              <div className="grid justify-center items-center">
                <h4 className="mt-2 text-lg font-semibold">{competencia.Nombre}</h4>
                <p className="text-sm">
                  Fecha: {new Date(competencia.Fecha).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Categoría:
                  {competencia.Categoria.map((cat) => cat.Nombre).join(", ")}
                </p>
                <p>Disciplina: {competencia.Disciplina}</p>
                <p className="text-sm">Género: {competencia.Genero}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
    </div>
  );
};

export default AdminHome;