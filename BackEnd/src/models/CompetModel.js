const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CompetenciaSchema = new schema({
  Nombre: {
    type: String,
    unique: true
  },
  Fecha: {
    type: Date,
    required: true
  },
  Disciplina: {
    type: String
  },
  Categoria: [{
    ref: 'Categorias',
    type: schema.Types.ObjectId
  }],
  Genero: {
    type: String
  },
  Imagen: {
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  },
  Atletas: [{
    ref: 'Atletas',
    type: schema.Types.ObjectId
  }],
  Pruebas: [{
    type: schema.Types.ObjectId,
    ref: "Pruebas" 
  }]
});


module.exports = mongoose.model('Competencias', CompetenciaSchema);
