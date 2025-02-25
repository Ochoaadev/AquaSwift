require('dotenv').config();  // Asegúrate de cargar las variables de entorno

const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@gestioncompetencia.nk7id.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=GestionCompetencia`;

module.exports = () => {

    const handleError = (e) => {
       console.error(`Ocurrió un error al conectar con la base de datos: ${e.message}`);
       process.exit(1);
    };
   
    const Connection = () => {
       mongoose
         .connect(uri)  // Elimina las opciones obsoletas
         .then(() => console.log('Conectado a la base de datos correctamente'))
         .catch(handleError);
    };
   
    Connection();
};

