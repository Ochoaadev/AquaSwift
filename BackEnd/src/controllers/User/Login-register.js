const Atleta = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
require('dotenv')

exports.signUp = async (req, res) =>{
    const {Nombre_Apellido, Username, Email, Contraseña, DNI, Fecha_Nacimiento} = req.body;

    const newUser = new Atleta({
        Nombre_Apellido,
        Username, 
        Email,
        Contraseña: await Atleta.encryptPassword(Contraseña),
        DNI,
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

exports.signIp = async (req, res) => { 
    try {
        // Buscar usuario por Email
        const userFound = await Atleta.findOne({ Email: req.body.Email });

        if (!userFound) {
            return res.status(400).json({ message: "El usuario no fue encontrado" });
        }

        // Verificar contraseña
        const ConfirmarPassword = await Atleta.comparePassword(req.body.Contraseña, userFound.Contraseña);
        if (!ConfirmarPassword) {
            return res.status(401).json({
                token: null,
                message: "Contraseña Inválida"
            });
        }

        // Generar token JWT
        const token = jwt.sign({ id: userFound._id }, process.env.SECRET, {
            expiresIn: 86400 // 24 horas
        });

        res.json({ token });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
