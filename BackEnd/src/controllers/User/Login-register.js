const Atleta = require('../../models/AtletaModels');
const Administrador = require('../../models/AdminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv')

exports.signUp = async (req, res) =>{
    const {Nombre_Apellido, Username, Email, Contrasena, DNI, Fecha_Nacimiento} = req.body;

    const newUser = new Atleta({
        Nombre_Apellido,
        Username, 
        Email,
        Contrasena: await Atleta.encryptPassword(Contrasena),
        DNI,
        Rol: "Usuario",
        Fecha_Nacimiento
    })

    const userSave =await newUser.save()
    console.log(userSave)
    const token = jwt.sign({id: userSave._id}, process.env.TOKEN_SECRET,{ //Se anota el secreto en nuestro archivo de entorno
        expiresIn: 86400 // 24h
    })
    res.status(200).json({
        message:"Se ha registrado correctamente",
        token
    })
}

exports.signIn = async (req, res) => {
    try {
        const { Email, Contrasena } = req.body;

        let userFound = await Atleta.findOne({ Email }); // Buscar en Atleta
        let Rol = "Usuario";

        if (!userFound) {
            userFound = await Administrador.findOne({ Email }); // Buscar en Administrador
            Rol = "Admin";
        }

        if (!userFound) {
            return res.status(400).json({ message: "El usuario no fue encontrado" });
        }

        // Verificar contraseña
        const ConfirmarPassword = await bcrypt.compare(Contrasena, userFound.Contrasena || userFound.Contrasena);
        if (!ConfirmarPassword) {
            return res.status(401).json({
                token: null,
                message: "Contraseña Inválida"
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: userFound._id, Rol },
            process.env.TOKEN_SECRET,
            { expiresIn: 86400 } // 24 horas
        );

        res.json({ token, Rol });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};