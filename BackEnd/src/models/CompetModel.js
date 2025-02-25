const mongoose = require('mongoose')
const schema = mongoose.Schema

const CompetenciaSchema = new schema({
    Nombre:{
        type: String,
        unique: true
    },
    Fecha:{
        type: date,
        required: true
    },
    Categoria:[{
        ref: 'Categorias',
        type: schema.Types.ObjectId
    }],
    Genero:{
        type:String
    }
})

modulo.exports = mongoose.model('Competencias', CompetenciaSchema);