const Atleta = require('../models/AtletaModels');


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
