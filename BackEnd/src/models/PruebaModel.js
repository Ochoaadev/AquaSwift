// models/PruebaModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PruebaSchema = new Schema({
  Nombre: {
    type: String,
    required: true,
  },
  Competencia: {
    type: Schema.Types.ObjectId, // Relación con la competencia
    ref: "Competencias",
    required: true,
  },
  Genero: {
    type: String,
    enum: ["Masculino", "Femenino", "Mixto"],
    required: true,
  },
  Categoria: {
    type: Schema.Types.ObjectId, // Relación con la categoría
    ref: "Categorias",
    required: true,
  },
});

module.exports = mongoose.model("Pruebas", PruebaSchema);