const mongoose = require('mongoose')
const schema = mongoose.Schema


const UserSchema = new schema({
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    cedula: {
        type: String,
        required: true,
    },
    birthDate: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('User', UserSchema);