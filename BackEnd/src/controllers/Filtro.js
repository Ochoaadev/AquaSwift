const Atleta = require('../models/AtletaModels'); 
const Competencia = require('../models/CompetModel'); 

const filtrar = async (req, res) => {
    const { nombreCompetencia, nombreApellido, username } = req.query;

    try {
        let filtro = {};

        if (nombreCompetencia) {
            // Buscar competencias por nombre
            const competencias = await Competencia.find({ Nombre: { $regex: nombreCompetencia, $options: 'i' } }).populate('Atletas');
            return res.status(200).json(competencias);
        }

        if (nombreApellido) {
            // Buscar atletas por nombre y apellido
            filtro.Nombre_Apellido = { $regex: nombreApellido, $options: 'i' };
        }

        if (username) {
            // Buscar atletas por username
            filtro.Username = { $regex: username, $options: 'i' };
        }


        if (Object.keys(filtro).length > 0) {
            // Buscar atletas que coincidan con el filtro
            const atletas = await Atleta.find(filtro).populate('Competencias');
            return res.status(200).json(atletas);
        }

        // Si no se proporciona ningún filtro, devolver todos los atletas
        const atletas = await Atleta.find().populate('Competencias');
        res.status(200).json(atletas);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { filtrar };