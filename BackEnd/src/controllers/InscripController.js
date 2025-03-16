const Inscripcion = require ("../models/InscripModel.js");
const Competencia = require ("../models/CompetModel.js");
const Atleta = require( "../models/AtletaModels.js");

// Inscribir a un atleta en una competencia
const inscribirAtleta = async (req, res) => {
  const { atletaId, competenciaId } = req.body;

  try {
    // Verificar que el atleta existe
    const atleta = await Atleta.findById(atletaId);
    if (!atleta) {
      return res.status(404).json({ message: "Atleta no encontrado" });
    }

    // Verificar que la competencia existe
    const competencia = await Competencia.findById(competenciaId);
    if (!competencia) {
      return res.status(404).json({ message: "Competencia no encontrada" });
    }

    // Verificar si el atleta ya está inscrito en la competencia
    const inscripcionExistente = await Inscripcion.findOne({
      Atleta: atletaId,
      Competencia: competenciaId,
    });
    if (inscripcionExistente) {
      return res.status(400).json({ message: "El atleta ya está inscrito en esta competencia" });
    }

    // Crear la inscripción
    const nuevaInscripcion = new Inscripcion({
      Atleta: atletaId,
      Competencia: competenciaId,
    });

    // Guardar la inscripción en la base de datos
    await nuevaInscripcion.save();

    res.status(201).json({
      message: "Inscripción realizada con éxito",
      inscripcion: nuevaInscripcion,
    });
  } catch (error) {
    console.error("Error en inscribir Atleta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todas las inscripciones de un atleta
const obtenerInscripcionesAtleta = async (req, res) => {
  const { atletaId } = req.params;

  try {
    const inscripciones = await Inscripcion.find({ Atleta: atletaId })
      .populate("Competencia") // Obtener detalles de la competencia
      .populate("Atleta"); // Obtener detalles del atleta

    res.status(200).json(inscripciones);
  } catch (error) {
    console.error("Error en obtenerInscripcionesAtleta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todas las inscripciones de una competencia
const obtenerInscripcionesCompetencia = async (req, res) => {
  const { competenciaId } = req.params;

  try {
    const inscripciones = await Inscripcion.find({ Competencia: competenciaId })
      .populate("Atleta") // Obtener detalles del atleta
      .populate("Competencia"); // Obtener detalles de la competencia

    res.status(200).json(inscripciones);
  } catch (error) {
    console.error("Error en obtenerInscripcionesCompetencia:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  inscribirAtleta,
  obtenerInscripcionesAtleta,
  obtenerInscripcionesCompetencia
}