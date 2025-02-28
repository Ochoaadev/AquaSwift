var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbconnection = require('./src/config/Conexion')
var routes = require('./src/routes/routes');
const bodyParser = require('body-parser');
const fs = require('fs')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

const CheckEnv = () => {
    try {
       fs.accessSync('.env', fs.constants.F_OK);
       //Si lo encuentra devuelve el console.log
       console.log('Archivo .env encontrado');
    } catch (err) {
       //Caso contrario, devuelve el error(Dicho error se visualiza en la consola, antes del [Running]-PORT)
       console.error('Error: Archivo .env no encontrado');
       process.exit(1)
    }
   };

   //Establece el puerto con el que se estará trabajando, así como también se establece el archivo Swagger.
   app.listen(4000, () => {
    console.log(`[Running] - PORT: 4000`);
    console.log("[Link]    " + "http://localhost:4000");
  });

    //Se establece conexión con la base de datos
    dbconnection()
    CheckEnv();

module.exports = app;
