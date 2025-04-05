const Inscripcion = require("../models/InscripModel");
const mongoose = require('mongoose');

// Crear una nueva inscripción
const createInscripcion = async (req, res) => {
  try {
    const { Atleta, Competencia, Prueba } = req.body;

    // Validación de campos requeridos
    if (!Atleta || !Competencia || !Prueba) {
      console.error('Campos faltantes en la solicitud');
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        missing: {
          Atleta: !Atleta,
          Competencia: !Competencia,
          Prueba: !Prueba
        }
      });
    }

    // Validación de formatos de ID
    if (!mongoose.isValidObjectId(Atleta) || 
        !mongoose.isValidObjectId(Competencia) || 
        !mongoose.isValidObjectId(Prueba)) {
      console.error('IDs no válidos');
      return res.status(400).json({
        success: false,
        message: "Formato de ID no válido"
      });
    }

    // Verificar duplicados
    const existeInscripcion = await Inscripcion.findOne({ Atleta, Competencia, Prueba });
    if (existeInscripcion) {
      console.error('Inscripción duplicada detectada');
      return res.status(400).json({
        success: false,
        message: "El atleta ya está inscrito en esta prueba"
      });
    }

    // Crear nueva inscripción
    const nuevaInscripcion = new Inscripcion({
      Atleta,
      Competencia,
      Prueba
    });

    const inscripcionGuardada = await nuevaInscripcion.save();
    console.log('Inscripción guardada exitosamente:');

    res.status(201).json({
      success: true,
      message: "Inscripción creada exitosamente",
      data: inscripcionGuardada
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
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