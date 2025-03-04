const Atleta = require('../models/AtletaModels')
const bcrypt = require('bcrypt');

//Listar
const Listar_Users = async (req, res) => {
    try {
       //Se inicializa usuarios con el model.find realizando la busqueda de los records.
       const user_list = await Atleta.find();
       res.status(200).json(user_list);
    } catch (error) {
       //Se muestra el error recibido en console log, en caso de ser asi.
       console.log("Error:", error);
       //Si la respuesta es 500 algun parametro no coincide y se retorna el mensaje o por conexión.
       res
       .status(500)
       .json({ message: "Error al intentar consultar los usuarios.", status: 500 });
    }
  };

//Obtener usuario

const Obten_User = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Atleta.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", status: 404 });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Error al intentar obtener al usuario, vuelvalo a intentar", status: 500 });
  }
};

//Eliminar Usuario

const Eliminar_User = async (req, res) => {
   const id = req.params.id;
   try {
      //Se realiza el llamado de findByIdAndDelete(id) transfiriendo id, para eliminar dicho record.
      const deleted = await Atleta.findByIdAndDelete(id);
      //Se valida la respuesta del mismo.
      if (!deleted) return res.status(404).send('Error: No se encontró el Usuario a eliminar.');
      res.status(200).json({ message: "Usuario Eliminado Satisfactoriamente!", status: 200, deleted: deleted });
  } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
         return res.status(400).send('Error: El ID del Usuario proporcionada no es válida.');
      } else {
         return res.status(500).send('Error al intentar eliminar el Usuario.');
      }
  }
};

//Editar usuario

const Edit_User = async (req, res) => {
  try {
    let user = await Atleta.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    user.Nombre_Apellido = req.body.Nombre_Apellido;
    user.Username = req.body.Username;
    user.Email = req.body.Email;
    user.Contrasena = req.body.Contrasena;
    user.DNI = req.body.DNI;
    user.Fecha_Nacimiento = req.body.Fecha_Nacimiento;

    await user.save();

    res.status(200).json({ msg: "Usuario Actualizado Correctamente", status:200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error",status:500 });
  }
};

//Actualizar Contraseña

const ActPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await Atleta.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ msg: "Usuario no encontrado", status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.Contrasena);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña antigua incorrecta" });
    }

    const salt = await bcrypt.genSalt(10);
    user.Contrasena = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({
        msg: "Error al intentar actualizar la contraseña",
        status: 500,
      });
  }
};

//Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await Atleta.findOne({ Email: email });
    if (!user) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos', status: 400 });
    }

    // Comparar la contraseña
    const isMatch = await Atleta.comparePassword(password, user.Contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos', status: 400 });
    }

    // Si todo está bien, devolver éxito
    res.status(200).json({ message: 'Inicio de sesión exitoso', status: 200, user });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor', status: 500 });
  }
};

module.exports = { 
    loginUser,
    Obten_User, 
    Eliminar_User,
    Edit_User,
    ActPassword,
    Listar_Users 
};