const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PruebaSchema = new Schema({
  Nombre: {
    type: String,
    required: true,
  },
  Estilo:{
    type: String,
    required:true
  },
  Disciplina:{
    type: String,
    required: true
  },
  Competencias: {
    type: [Schema.Types.ObjectId],  // Array de ObjectIds
    ref: "Competencias",
    required: true,
    default: [] 
  }
});

module.exports = mongoose.model("Pruebas", PruebaSchema);