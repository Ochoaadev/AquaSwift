const Atleta = require('../models/AtletaModels');
const Administrador = require('../models/AdminModel')

exports.ChequeoExistenciaUser = async(req, res, next)=>{ 
    try{
        //Verificar la existencia del username 
        const UserF = await Atleta.findOne({ Username : req.body.Username})
        if(UserF){
            return res.status(400).json({
                message: "El usuario ya se encuentra en uso"
            });
        }
        //Verificar la existencia del email
        const UserEmailF = await Atleta.findOne({Email : req.body.Email})
            if(UserEmailF){
                return res.status(400).json({
                    message: "El correo ya se encuentra en uso"
                })
            }

        next()
    }catch(error){
        res.status(500).json({
            message: error.message   
        }); 
    }
}

exports.verifySession = async (req, res) => {
    try {
        let user = await Atleta.findById(req.userId).select("-Contrasena"); // Excluir contraseña
        if (!user) {
            user = await Administrador.findById(req.userId).select("-Contrasena");
        }

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ user, Rol: req.userRol });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar sesión" });
    }
};
