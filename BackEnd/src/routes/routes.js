const express = require('express')
const router = express.Router();

//Importaciones de rutas

const { createAdministrador, deleteAdministrador, getAdministradores } = require('../controllers/adminController');
const { Obten_User, Eliminar_User, Edit_User, ActPassword, Listar_Users } = require('../controllers/AtletaController');
const {signIn, signUp, logout} = require('../controllers/User/Login-register')
const {CreateCompet, DeleteCompet, UpdateCompet, getAllCompet, getByIdCompet} = require('../controllers/CompetController');
const {createCategoria, deleteCategoria, getCategoriaById, getCategorias, updateCategoria} = require('../controllers/CategoriaController')

//Importación de middlewares a usar

const {ChequeoExistenciaUser} = require('../middlewares/VerifyExistingUser')

//Rutas definidas

//Registro - Login - Cierre

// Ruta para registrarse
router.post('/registro', ChequeoExistenciaUser, signUp);

// Ruta para iniciar sesión
router.post('/login', signIn);

//Ruta para cierre de sesión
router.post("/logout", logout); 

//Administrador

router.post('/admin', createAdministrador);
router.get('/admin', getAdministradores);
router.delete('/admin/:id', deleteAdministrador);

//Atletas

// Ruta para listar todos los usuarios
router.get('/usuarios', Listar_Users);
// Ruta para obtener un usuario por ID
router.get('/usuarios/:id', Obten_User);
// Ruta para eliminar un usuario por ID
router.delete('/usuarios/:id', Eliminar_User);
// Ruta para editar un usuario por ID
router.put('/usuarios/:id', Edit_User);
// Ruta para actualizar la contraseña de un usuario
router.put('/usuarios/:id/password', ActPassword);

//Competencias

router.get('/competencias', getAllCompet);
router.get('/competencias/:id', getByIdCompet);
router.post('/competencias', CreateCompet);
router.put('/competencias/:id', UpdateCompet);
router.delete('/competencias/:id', DeleteCompet)

//Categorias

router.get('/Categorias', getCategorias)
router.get('/Categorias/:id', getCategoriaById)
router.post('/Categorias', createCategoria)
router.put('/Categorias/:id', updateCategoria)
router.delete('/Categorias/:id', deleteCategoria)


module.exports = router

