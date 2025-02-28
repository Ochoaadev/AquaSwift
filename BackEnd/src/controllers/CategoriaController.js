const Categoria = require("../models/CategoriaModel");

//Crear una nueva categoría
const createCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    await nuevaCategoria.save();
    res.status(201).json({ msg: "Categoría creada exitosamente", categoria: nuevaCategoria });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Actualizar una categoría
const updateCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoriaActualizada) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    res.status(200).json({ msg: "Categoría actualizada correctamente", categoria: categoriaActualizada });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Eliminar una categoría
const deleteCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    res.status(200).json({ msg: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

module.exports = {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria
};
