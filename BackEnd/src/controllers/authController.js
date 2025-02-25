const User = require('../models/userSchema');
require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


class AuthController {
  static async register(req, res) {
    try {
      const rol = 'user';
      const { fullName, email, password, gender, cedula, birthDate } = req.body;

      // Verificar si el usuario ya existe por email o cédula
      const existingUser = await User.findOne({ $or: [{ email }, { cedula }] });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo o la cédula ya están registrados' });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear nuevo usuario
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        rol,
        gender,
        birthDate,
        cedula
      });
      await newUser.save();

      // Generar token
      const token = jwt.sign({ id: newUser._id, email: newUser.email, rol: newUser.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: { _id: newUser._id, fullName, email, rol, gender, birthDate, cedula, token }
      });
    } catch (error) {
      console.log('Error registro', error);
      res.status(500).json({ message: 'Error en el servidor', error });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales incorrectas' });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales incorrectas' });
      }

      // Generar token
      const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Inicio de sesión exitoso',
        user: { _id: newUser._id, fullName, email, rol, gender, birthDate, cedula, token }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor', error });
    }
  }
}


module.exports = AuthController;
