const Prueba = require('../models/PruebaModel');

// Crear una nueva prueba asociada a una o más competencias
exports.createPrueba = async (req, res) => {
  try {
    const { Nombre, Disciplina, Estilo, Competencias } = req.body;
    
    const nuevaPrueba = new Prueba({
      Nombre,
      Disciplina,
      Estilo,
      Competencias: Array.isArray(Competencias) ? Competencias : [Competencias] // Asegura que sea array
    });

    const pruebaGuardada = await nuevaPrueba.save();
    res.status(201).json(pruebaGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las pruebas (pueden pertenecer a múltiples competencias)
exports.getPruebas = async (req, res) => {
  try {
    const pruebas = await Prueba.find().populate('Competencias');
    res.json(pruebas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener pruebas por competencia específica
exports.getPruebasByCompetencia = async (req, res) => {
  try {
    const { competenciaId } = req.params;
    const pruebas = await Prueba.find({ Competencias: competenciaId });
    res.json(pruebas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deletePrueba = async (req, res) => {
  try {
    const { id } = req.params;
    await Prueba.findByIdAndDelete(id);
    res.json({ message: 'Prueba eliminada de todas las competencias' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Añadir una competencia adicional a una prueba existente
exports.addCompetenciaToPrueba = async (req, res) => {
  try {
    const { id } = req.params;
    const { competenciaId } = req.body;
    
    const prueba = await Prueba.findByIdAndUpdate(
      id,
      { $addToSet: { Competencias: competenciaId } }, 
      { new: true }
    );
    
    res.json(prueba);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remover una competencia específica de una prueba
exports.removeCompetenciaFromPrueba = async (req, res) => {
  try {
    const { id, competenciaId } = req.params;
    
    const prueba = await Prueba.findByIdAndUpdate(
      id,
      { $pull: { Competencias: competenciaId } },
      { new: true }
    );
    
    res.json(prueba);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};