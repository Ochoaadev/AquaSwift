const Atleta = require('../../models/AtletaModels');
const Administrador = require('../../models/AdminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv')

exports.signUp = async (req, res) =>{
    const {Nombre_Apellido, Username, Email, Contrasena, DNI, Genero, Fecha_Nacimiento} = req.body;

    const newUser = new Atleta({
        Nombre_Apellido,
        Username, 
        Email,
        Contrasena: await Atleta.encryptPassword(Contrasena),
        DNI,
        Rol: "Usuario",
        Genero,
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
        const { Email, Username, Contrasena } = req.body;

        // Validar que se proporcione al menos Email o Username
        if (!Email && !Username) {
            return res.status(400).json({ message: "Se requiere Email o Username" });
        }

        let userFound = null;
        let Rol = "Usuario";

        // Buscar en Atleta por Email o Username
        if (Email) {
            userFound = await Atleta.findOne({ Email });
        } else if (Username) {
            userFound = await Atleta.findOne({ Username });
        }

        // Si no se encuentra en Atleta, buscar en Administrador
        if (!userFound) {
            if (Email) {
                userFound = await Administrador.findOne({ Email });
            } else if (Username) {
                userFound = await Administrador.findOne({ Username });
            }
            Rol = "Admin";
        }

        // Si no se encuentra en ninguna colección
        if (!userFound) {
            return res.status(400).json({ message: "El usuario no fue encontrado" });
        }

        // Verificar contraseña
        const ConfirmarPassword = await bcrypt.compare(Contrasena, userFound.Contrasena);
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

        // Retornar el token, el rol y el _id
        res.json({ token, Rol, _id: userFound._id });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};


exports.logout = (req, res) => {
    try {
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).json({ message: "Error al cerrar sesión" });
    }
};
