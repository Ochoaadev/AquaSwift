const Competencia = require('../models/CompetModel');
const { cloudinary } = require('../config/cloudinary');

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
    let imagenData = null; // Definir imagenData fuera del try-catch

    try {
        // Caso 1: Subir imagen mediante archivo
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'competencias'
            });
            imagenData = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }
        // Caso 2: Subir imagen mediante URL
        else if (req.body.imagenUrl) {
            const result = await cloudinary.uploader.upload(req.body.imagenUrl, {
                folder: 'competencias'
            });
            imagenData = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }
        // Caso 3: No se proporcionó imagen
        else {
            return res.status(400).json({ message: 'Debe proporcionar una imagen (archivo o URL)' });
        }

        // Crear nueva competencia
        const nuevaCompetencia = new Competencia({
            ...req.body,
            Imagen: imagenData
        });

        const competenciaGuardada = await nuevaCompetencia.save();
        res.status(201).json(competenciaGuardada);

    } catch (error) {
        console.error('Error en CreateCompet:', error);
        
        // Eliminar imagen subida si hay error
        if (imagenData?.public_id) {
            await cloudinary.uploader.destroy(imagenData.public_id);
        }
        
        res.status(400).json({ 
            message: 'Error al crear la competencia',
            error: error.message 
        });
    }
};

const UpdateCompet = async (req, res) => {
    try {
        const competencia = await Competencia.findById(req.params.id);
        if (!competencia) {
            return res.status(404).json({ message: 'Competencia no encontrada' });
        }

        let updateData = { ...req.body };
        let newImageData = null;

        // Caso 1: Hay nueva imagen
        if (req.file) {
            // Subir nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'competencias'
            });
            newImageData = {
                public_id: result.public_id,
                url: result.secure_url
            };

            // Eliminar imagen anterior SI existe
            if (competencia.Imagen?.public_id) {
                await cloudinary.uploader.destroy(competencia.Imagen.public_id);
            }
            
            updateData.Imagen = newImageData;
        }

        // Caso 2: No hay nueva imagen (mantener la existente)
        // No se hace nada con el campo Imagen

        // Actualizar la competencia
        const competenciaActualizada = await Competencia.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // Asegura validaciones del modelo
        );

        res.status(200).json(competenciaActualizada);

    } catch (error) {
        console.error('Error en UpdateCompet:', error);
        
        // Eliminar nueva imagen subida si hubo error
        if (req.file && newImageData?.public_id) {
            await cloudinary.uploader.destroy(newImageData.public_id);
        }
        
        res.status(400).json({ 
            message: 'Error al actualizar la competencia',
            error: error.message 
        });
    }
}

// Eliminar competencia 
const DeleteCompet = async (req, res) => {
    try {
        const competencia = await Competencia.findById(req.params.id);
        
        if (!competencia) {
            return res.status(404).json({ message: 'Competencia no encontrada' });
        }

        // Eliminar imagen de Cloudinary
        if (competencia.Imagen?.public_id) {
            await cloudinary.uploader.destroy(competencia.Imagen.public_id);
        }

        await Competencia.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Competencia eliminada correctamente' });

    } catch (error) {
        console.error('Error en DeleteCompet:', error);
        res.status(500).json({ 
            message: 'Error al eliminar la competencia',
            error: error.message 
        });
    }
}


module.exports = {
    getAllCompet,
    getByIdCompet,
    CreateCompet,
    UpdateCompet,
    DeleteCompet

}
