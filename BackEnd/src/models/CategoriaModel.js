const mongoose = require('mongoose')
const schema = mongoose.Schema

const CategoriaSchema = new schema({
    Nombre: {
        type: String,
        required: true
    },
    Edad:{
        type: Number,
        required: true
    },
    Genero:{
        type: String,
        required: true
    },
    Modalidad:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Categorias', CategoriaSchema);