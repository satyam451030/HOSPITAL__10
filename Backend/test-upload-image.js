import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, 'temp-test-image.png');
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/18eAAAAAElFTkSuQmCC';
fs.writeFileSync(imagePath, Buffer.from(base64, 'base64'));

const args = [
  'http://localhost:5000/api/doctors',
  '-F', 'name=Test Doctor Image',
  '-F', 'specialization=Cardiology',
  '-F', 'email=test.image@example.com',
  '-F', 'password=Test1234!',
  '-F', 'experience=5 years',
  '-F', 'qualifications=MBBS',
  '-F', 'location=City',
  '-F', 'about=Testing add doctor with actual image',
  '-F', 'fee=500',
  '-F', 'success=Test',
  '-F', 'patients=100',
  '-F', 'rating=4',
  '-F', 'availability=Available',
  '-F', 'schedule={"2026-06-09":["10:00 AM"]}',
  '-F', `image=@${imagePath}`,
];

const { spawn } = await import('child_process');
const curl = spawn('curl.exe', ['-i', '-X', 'POST', ...args]);
let out = '';
let err = '';
curl.stdout.on('data', (chunk) => out += chunk.toString());
curl.stderr.on('data', (chunk) => err += chunk.toString());
curl.on('close', (code) => {
  console.log('exit', code);
  console.log('stdout:', out);
  console.log('stderr:', err);
  fs.unlinkSync(imagePath);
});
