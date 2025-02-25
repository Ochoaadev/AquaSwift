const mongoose = require('mongoose')
const schema = mongoose.Schema

const CategoriaSchema = new schema({
    Nombre: {
        type: String
    },
    Edad:{
        type: Number,
    },
    Genero:{
        type: String
    },
    Modalidad:{
        type: String,
    },
    Nivel:{
        type: String
    }
})

module.exports = mongoose.model('Categorias', CategoriaSchema);