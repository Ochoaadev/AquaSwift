const Inscripcion = require("../models/InscripModel");

// Crear una nueva inscripción
const createInscripcion = async (req, res) => {
  try {
    const { Atleta, Competencia, Prueba } = req.body;

    // Verificar si ya existe una inscripción para este atleta en la misma prueba
    const inscripcionExistente = await Inscripcion.findOne({
      Atleta,
      Competencia,
      Prueba,
    });

    if (inscripcionExistente) {
      return res.status(400).json({ message: "El atleta ya está inscrito en esta prueba." });
    }

    const nuevaInscripcion = new Inscripcion({
      Atleta,
      Competencia,
      Prueba,
    });

    await nuevaInscripcion.save();
    res.status(201).json(nuevaInscripcion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la inscripción", error });
  }
};

// Obtener todas las inscripciones
const getAllInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find()
      .populate("Atleta")
      .populate("Competencia")
      .populate("Prueba");
    res.status(200).json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las inscripciones", error });
  }
};

// Obtener inscripciones por atleta
const getInscripcionesByAtleta = async (req, res) => {
  try {
    const { atletaId } = req.params;
    const inscripciones = await Inscripcion.find({ Atleta: atletaId })
      .populate("Competencia")
      .populate("Prueba");
    res.status(200).json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las inscripciones del atleta", error });
  }
};

// Obtener inscripciones por competencia
const getInscripcionesByCompetencia = async (req, res) => {
  try {
    const { competenciaId } = req.params;
    const inscripciones = await Inscripcion.find({ Competencia: competenciaId })
      .populate("Atleta")
      .populate("Prueba");
    res.status(200).json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las inscripciones de la competencia", error });
  }
};

// Obtener inscripciones por prueba
const getInscripcionesByPrueba = async (req, res) => {
  try {
    const { pruebaId } = req.params;
    const inscripciones = await Inscripcion.find({ Prueba: pruebaId })
      .populate("Atleta")
      .populate("Competencia");
    res.status(200).json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las inscripciones de la prueba", error });
  }
};

// Actualizar el estado de una inscripción
const updateInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { Estado } = req.body;

    const inscripcionActualizada = await Inscripcion.findByIdAndUpdate(
      id,
      { Estado },
      { new: true }
    );

    if (!inscripcionActualizada) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    res.status(200).json(inscripcionActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la inscripción", error });
  }
};

// Eliminar una inscripción
const deleteInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcionEliminada = await Inscripcion.findByIdAndDelete(id);

    if (!inscripcionEliminada) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    res.status(200).json({ message: "Inscripción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la inscripción", error });
  }
};

module.exports = {
  createInscripcion,
  getAllInscripciones,
  getInscripcionesByAtleta,
  getInscripcionesByCompetencia,
  getInscripcionesByPrueba,
  updateInscripcion,
  deleteInscripcion,
};