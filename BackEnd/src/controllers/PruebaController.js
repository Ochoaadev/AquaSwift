// controllers/pruebaController.js
const Prueba = require("../models/PruebaModel");

// Crear una nueva prueba
const createPrueba = async (req, res) => {
  try {
    const { Nombre, Competencia, Genero, Categoria } = req.body;
    const nuevaPrueba = new Prueba({
      Nombre,
      Competencia,
      Genero,
      Categoria,
    });
    await nuevaPrueba.save();
    res.status(201).json(nuevaPrueba);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la prueba", error });
  }
};

// Obtener todas las pruebas de una competencia
const getPruebasByCompetencia = async (req, res) => {
  try {
    const { competenciaId } = req.params;
    const pruebas = await Prueba.find({ Competencia: competenciaId }).populate("Categoria");
    res.status(200).json(pruebas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las pruebas", error });
  }
};

// Actualizar una prueba
const updatePrueba = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Distancia, Estilo, Genero, Categoria } = req.body;
    const pruebaActualizada = await Prueba.findByIdAndUpdate(
      id,
      { Nombre, Distancia, Estilo, Genero, Categoria },
      { new: true }
    );
    res.status(200).json(pruebaActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la prueba", error });
  }
};

// Eliminar una prueba
const deletePrueba = async (req, res) => {
  try {
    const { id } = req.params;
    await Prueba.findByIdAndDelete(id);
    res.status(200).json({ message: "Prueba eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la prueba", error });
  }
};

module.exports = {
  createPrueba,
  getPruebasByCompetencia,
  updatePrueba,
  deletePrueba,
};