import React, { useState, useContext } from "react";
import { useItemsContext, useUpItemsContext } from "../../contexts/UpProvider"; 

const CreateCompetenciaForm = () => {
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
    <div>
      <h2>Crear Nueva Competencia</h2>
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
      </form>

      {/* Listado Horizontal de Competencias */}
      <div style={{ marginTop: "20px" }}>
        <h3>Competencias Existentes</h3>
        <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
          {items
            .filter((competencia) => competencia.Imagen)
            .map((competencia) => (
            <div
              key={competencia._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              <img
                 src={competencia.Imagen?.url}
                 alt={competencia.Nombre}
                 style={{ width: "50%", height: "auto", borderRadius: "10px" }}
              />
              <h4>{competencia.Nombre}</h4>
               <p>Fecha: {new Date(competencia.Fecha).toLocaleDateString()}</p>
                <p>
                    Categoría:{" "}
                    {competencia.Categoria
                    .map((cat) => cat.Nombre) // Accede a la propiedad "Nombre" de cada categoría
                    .join(", ")} {/* Convierte el array en un string separado por comas */}
                </p>
                <p>Disciplina: {competencia.Disciplina}</p>
                <p>Género: {competencia.Genero}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCompetenciaForm;