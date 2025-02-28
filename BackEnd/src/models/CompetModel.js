const mongoose = require('mongoose')
const schema = mongoose.Schema

const CompetenciaSchema = new schema({
    Nombre:{
        type: String,
        unique: true
    },
    Fecha:{
        type: Date,
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


module.exports = mongoose.model('Competencias', CompetenciaSchema);