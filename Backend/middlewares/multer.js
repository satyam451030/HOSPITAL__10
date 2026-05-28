import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}   // Ensure the uploads directory exists

// Configure multer storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Only JPEG, PNG, JPG, and WEBP are allowed.'), false);
    }
};

// Initialize multer with the defined storage and file filter
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB

    export default upload;