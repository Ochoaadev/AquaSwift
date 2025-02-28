const bcrypt = require('bcrypt');
const Administrador = require('../models/AdminModel');

const CreateAdmin = async (req, res) => {
  try {
    // Extraer campos del cuerpo de la solicitud
    const { Nombre_Apellido, Email, Contrasena } = req.body;

    // Validaciones adicionales
    if (!Nombre_Apellido || !Email || !Contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de longitud de la contraseña
    if (Contrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    // Crear el nuevo administrador
    const nuevoAdministrador = await Administrador.create({
      Nombre_Apellido,
      Email,
      Contrasena: hashedPassword,
      Rol: "Admin"
    });

    // Enviar respuesta exitosa
    res.status(201).json({ mensaje: 'Administrador registrado exitosamente', administrador: nuevoAdministrador });
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
  }
};

const GetAdmin = async (req, res) => {
  try {
    const administradores = await Administrador.find(); // 🔹 Usar find() en lugar de findAll()
    res.status(200).json(administradores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const DeleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el administrador existe
    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    // Eliminar el administrador
    await administrador.destroy();
    res.status(200).json({ mensaje: 'Administrador eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    res.status(500).json({ error: 'Error al eliminar el administrador' });
  }
};

module.exports = {
    createAdministrador: CreateAdmin,
    deleteAdministrador: DeleteAdmin,
    getAdministradores: GetAdmin
}