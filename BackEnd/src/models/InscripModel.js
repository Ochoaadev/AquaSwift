const mongoose = require('mongoose')

const InscripcionSchema = new mongoose.Schema({
  Atleta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Atleta", 
    required: true,
  },
  Competencia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competencia",
    required: true,
  },
  FechaInscripcion: {
    type: Date,
    default: Date.now, // Fecha automática al momento de la inscripción
  },
  Estado: {
    type: String,
    enum: ["Pendiente", "Aprobada", "Rechazada"], // Estados posibles
    default: "Pendiente",
  },
});

module.exprots = mongoose.model("Inscripcion", InscripcionSchema);
