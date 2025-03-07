require('dotenv').config();  // Asegúrate de cargar las variables de entorno
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Configura el almacenamiento para Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'competencias', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Formatos permitidos
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Transformaciones opcionales
  }
});

module.exports = { cloudinary, storage };