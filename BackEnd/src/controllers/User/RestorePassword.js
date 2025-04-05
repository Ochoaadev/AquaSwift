const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Atleta = require('../../models/AtletaModels'); 
const bcrypt = require('bcrypt');
require(`dotenv`).config();


const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

// Función para generar un token de recuperación
function generarToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Controlador para solicitar recuperación de contraseña
exports.solicitarRecuperacion = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Atleta.findOne({ Email: email });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Generar token y guardarlo en el usuario
        const token = generarToken();
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez

        await usuario.save();

        // Enviar correo electrónico
        const mailOptions = {
            to: usuario.Email,
            from: 'AquaSwiftDepart@gmail.com',
            subject: 'Recuperación de contraseña',
            text: `Para cambiar tu contraseña, ingresa el siguiente código en la página:\n\n
            ${token}\n\n
            Si no solicitaste este cambio, ignora este correo.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ mensaje: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la solicitud', error });
    }
};

// Controlador para cambiar la contraseña
exports.cambiarContrasena = async (req, res) => {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;

    try {
        // Buscar al usuario con el token y verificar que no haya expirado
        const usuario = await Atleta.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ mensaje: 'El token es inválido o ha expirado' });
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10); // Generar un "salt"
        const hashedPassword = await bcrypt.hash(nuevaContrasena, salt); // Hashear la contraseña

        // Guardar la contraseña hasheada y limpiar el token
        usuario.Contrasena = hashedPassword;
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;

        await usuario.save();

        res.status(200).json({ mensaje: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cambiar la contraseña', error });
    }
};