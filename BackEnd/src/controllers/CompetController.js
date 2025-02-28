const Competencia = require('../models/CompetModel');

// Obtener todas las competencias
    const getAllCompet = async (req, res) => {
        try {
            const competencias = await Competencia.find().populate('Categoria');
            res.status(200).json(competencias);
        } catch (error) {
            console.log("Error en getAll:", error);
            res.status(500).json({ message: 'Error al obtener las competencias', error });
        }
    }

// Obtener una competencia por ID
    const getByIdCompet = async (req, res) => {
        try {
            const competencia = await Competencia.findById(req.params.id).populate('Categoria');
            if (!competencia) {
                return res.status(404).json({ message: 'Competencia no encontrada' });
            }
            res.status(200).json(competencia);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la competencia', error });
        }
    }

// Crear una nueva competencia
    const CreateCompet = async (req, res) => {
        try {
            const nuevaCompetencia = new Competencia(req.body);
            const competenciaGuardada = await nuevaCompetencia.save();
            res.status(201).json(competenciaGuardada);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear la competencia', error });
        }
    }

// Actualizar una competencia por ID
    const UpdateCompet = async (req, res) => {
        try {
            const competenciaActualizada = await Competencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!competenciaActualizada) {
                return res.status(404).json({ message: 'Competencia no encontrada' });
            }
            res.status(200).json(competenciaActualizada);
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar la competencia', error });
        }
    }

// Eliminar una competencia por ID
    const DeleteCompet = async (req, res) => {
        try {
            const competenciaEliminada = await Competencia.findByIdAndDelete(req.params.id);
            if (!competenciaEliminada) {
                return res.status(404).json({ message: 'Competencia no encontrada' });
            }
            res.status(200).json({ message: 'Competencia eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la competencia', error });
        }
    }


module.exports = {
    getAllCompet,
    getByIdCompet,
    CreateCompet,
    UpdateCompet,
    DeleteCompet

}
