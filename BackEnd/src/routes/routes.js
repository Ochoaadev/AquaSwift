const express = require('express')
const router = express.Router();

//Importaciones de rutas

const { createAdministrador, deleteAdministrador, getAdministradores } = require('../controllers/AdminController');
const { Obten_User, Eliminar_User, Edit_User, ActPassword, Listar_Users} = require('../controllers/AtletaController');
const {signIn, signUp, logout} = require('../controllers/User/Login-register')
const {CreateCompet, DeleteCompet, UpdateCompet, getAllCompet, getByIdCompet} = require('../controllers/CompetController');
const {createCategoria, deleteCategoria, getCategoriaById, getCategorias, updateCategoria} = require('../controllers/CategoriaController')
const {createInscripcion, getAllInscripciones, getInscripcionesByAtleta, getInscripcionesByCompetencia, getInscripcionesByPrueba, updateInscripcion, deleteInscripcion} = require('../controllers/InscripController');
const {createPrueba, getPruebas, getPruebasByCompetencia, deletePrueba, addCompetenciaToPrueba, removeCompetenciaFromPrueba} = require('../controllers/PruebaController');
const {solicitarRecuperacion, cambiarContrasena} = require('../controllers/User/RestorePassword')
const {createResultado, deleteResultado, getResultadosByCompetencia, getResultadosByPrueba, updateResultado } = require('../controllers/ResultController');

//Filtro de busqueda

const {filtrar} = require('../controllers/Filtro')

//Importación de middlewares a usar

const {ChequeoExistenciaUser, verifySession} = require('../middlewares/VerifyExistingUser');
const upload = require('../middlewares/multer');
const {exportToExcel, exportToPDF} = require('../middlewares/ExportsDocuments');

//Rutas definidas

//Chequear si el usuario está autenticado al cargar la app

router.get('/VerifySession', verifySession)

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
router.post('/competencias', upload.single('Imagen'), CreateCompet);
router.put('/competencias/:id', upload.single('Imagen'), UpdateCompet);
router.delete('/competencias/:id', DeleteCompet)

//Categorias

router.get('/Categorias', getCategorias)
router.get('/Categorias/:id', getCategoriaById)
router.post('/Categorias', createCategoria)
router.put('/Categorias/:id', updateCategoria)
router.delete('/Categorias/:id', deleteCategoria)

//Filtro de busqueda

router.get('/Filtrar', filtrar);

//Inscripciones


router.post("/inscripciones", createInscripcion);
router.get("/inscripciones", getAllInscripciones);
// Obtener inscripciones por atleta
router.get("/inscripciones/atleta/:atletaId", getInscripcionesByAtleta);
// Obtener inscripciones por competencia
router.get("/inscripciones/competencia/:competenciaId", getInscripcionesByCompetencia);
// Obtener inscripciones por prueba
router.get("/inscripciones/prueba/:pruebaId", getInscripcionesByPrueba);
// Actualizar el estado de una inscripción
router.put("/inscripciones/:id", updateInscripcion);
router.delete("/inscripciones/:id", deleteInscripcion);

//Pruebas

router.post("/pruebas", createPrueba);
router.get("/pruebas/", getPruebas)
router.get("/pruebas/competencia/:competenciaId", getPruebasByCompetencia);
router.delete("/pruebas/:id", deletePrueba);

// Rutas específicas para manejo de competencias
router.get('/pruebas/competencia/:competenciaId', getPruebasByCompetencia); // Obtener pruebas por competencia
router.patch('/pruebas/:id/competencias', addCompetenciaToPrueba); // Añadir competencia a prueba
router.delete('/pruebas/:id/competencias/:competenciaId', removeCompetenciaFromPrueba); // Remover competencia de prueba

//Recuperación de contraseña

router.post('/solicitar-recuperacion', solicitarRecuperacion);
router.post('/reset-password/:token', cambiarContrasena);

//Resultados

// Rutas CRUD
router.post('/competencias/:competenciaId/resultados', createResultado);
  
router.get('/competencias/:competenciaId/resultados',getResultadosByCompetencia );
  
router.get('/competencias/:competenciaId/pruebas/:pruebaId/resultados', getResultadosByPrueba);
  
router.put('/resultados/:id', updateResultado);
  
router.delete('/resultados/:id', deleteResultado);
  
// Rutas de exportación

router.get('/competencias/:competenciaId/export/excel',exportToExcel);
  
router.get('/competencias/:competenciaId/export/pdf', exportToPDF);

module.exports = router