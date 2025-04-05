const jwt = require("jsonwebtoken");
require('dotenv').config();
// json web token (JWT)

function GenerarToken(payload) {
  const secret = process.env.TOKEN_SECRET;
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secret, options);
}

function Autenticacion(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // Extrayendo el token
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    // Verificando token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded; // Pasar datos decodificados al siguiente middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

function DecodificarToken(token) {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      resolve(payload);
    } catch (error) {
      reject("Token inválido o expirado");
    }
  });
}

// const ValidarRol = async (req, res) => {
//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: "Token no proporcionado" });
//   }

//   const token = req.headers.authorization.replace("Bearer ", "");

//   try {
//     // Decodificando y verificando el token
//     const payload = await DecodificarToken(token);

//     if (payload && payload.rol) {
//       // Aquí puedes comparar el rol esperado 
//       res.status(200).json({ payload, message: "Rol validado", status: 200 });
//     } else {
//       res.status(403).json({ message: "Permisos insuficientes" });
//     }
//   } catch (error) {
//     res.status(401).json({ message: error });
//   }
// };

module.exports = { 
    GenerarToken, 
    Autenticacion, 
    DecodificarToken, 
    // ValidarRol 
};