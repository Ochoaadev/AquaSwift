const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController')

// Rutas para la autenticación de usuarios
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;