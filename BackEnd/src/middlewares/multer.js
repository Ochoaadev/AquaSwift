const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Límite de 5MB
});

module.exports = upload;