import fs from 'fs';
import path from 'path';
import {v2 as cloudinary} from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, 'temp-test-image.png');
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/18eAAAAAElFTkSuQmCC';
fs.writeFileSync(imagePath, Buffer.from(base64, 'base64'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload(imagePath, { folder: 'doctors' })
  .then((result) => {
    console.log('UPLOAD SUCCESS', result);
  })
  .catch((err) => {
    console.error('UPLOAD ERROR', err);
  })
  .finally(() => {
    fs.unlinkSync(imagePath);
  });
