const mongoose = require('mongoose')
const schema = mongoose.Schema

const AdminSchema = new schema({
    Nombre_Apellido:{
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Username:{
        type: String,
        required: true
    },
    Contrasena:{
        type:String,
        required: true
    },
    Rol:{
        type: String
    }
})

module.exports = mongoose.model('Admin', AdminSchema);