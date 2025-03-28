const mongoose = require('mongoose')
const schema = mongoose.Schema

const CategoriaSchema = new schema({
    Nombre: {
        type: String,
        required: true
    },
    Edad:{
        type: String,
        required: true
    },
    Genero:{
        type: String,
        enum: ["Masculino", "Femenino", "Mixto"],
        required: true
    },
    Modalidad:{
        type: String,
        enum: ["Natacion", "Acuatlon", "Triatlon"],
        required: true
    }
})

module.exports = mongoose.model('Categorias', CategoriaSchema);