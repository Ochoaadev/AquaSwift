const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ResultadoSchema = new Schema({
  Competencia: {
    type: Schema.Types.ObjectId,
    ref: 'Competencias',
    required: true
  },
  Prueba: {  
    type: Schema.Types.ObjectId,
    ref: 'Pruebas',
    required: true
  },
  Atleta: {
    type: Schema.Types.ObjectId,
    ref: 'Atletas',
    required: true
  },
  Posicion: {
    type: Number,
    required: false
  },
  Marca: {
    type: String,
    required: true
  },
  Puntos: {
    type: Number,
    default: 0
  },
  FechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resultados', ResultadoSchema);