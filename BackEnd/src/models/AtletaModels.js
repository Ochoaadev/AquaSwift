const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

const AtletaSchema = new schema({
    Nombre_Apellido:{
        type: String,
        required: true
    },
    Username:{
        type: String,
        required: true,
        unique: true
    },
    Email:{
        type: String,
        required: true,
        unique: true
    },
    Contrasena:{
        type: String,
        required: true
    },
    DNI:{
        type: Number,
        required: true,
        unique: true
    },
    Rol:{
        type: String
    },
    Genero:{
        type: String,
        required:true
    },
    Fecha_Nacimiento:{
        type: Date,
        required: true
    }
})

//Cifrar contraseña
AtletaSchema.statics.encryptPassword = async(Contraseña)=>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(Contraseña, salt)
  }
//Comparar contraseña
  AtletaSchema.statics.comparePassword = async(Contraseña, receivedContraseña) =>{
    return await bcrypt.compare(Contraseña, receivedContraseña)
  }

module.exports = mongoose.model('Atletas', AtletaSchema);