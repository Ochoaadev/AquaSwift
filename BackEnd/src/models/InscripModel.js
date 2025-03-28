const mongoose = require('mongoose');

const InscripcionSchema = new mongoose.Schema({
  Atleta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Atletas",
    required: true
  },
  Competencia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competencias",
    required: true
  },
  Prueba: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pruebas",
    required: true
  },
  FechaInscripcion: {
    type: Date,
    default: Date.now
  },
});

// Agregar índice compuesto para evitar duplicados
InscripcionSchema.index({ Atleta: 1, Competencia: 1, Prueba: 1 }, { unique: true });

module.exports = mongoose.model('Inscripciones', InscripcionSchema);