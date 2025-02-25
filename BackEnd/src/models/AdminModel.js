const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

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
    Contraseña:{
        type:String,
        required: true
    }
})

AdminSchema.statics.encryptPassword = async(Contraseña)=>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(Contraseña, salt)
  }
  
AdminSchema.statics.comparePassword = async(Contraseña, receivedContraseña) =>{
    return await bcrypt.compare(Contraseña, receivedContraseña)
  }

module.exports = mongoose.model('Admin', AdminSchema);