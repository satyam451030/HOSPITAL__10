import express from 'express';

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  toggleDoctorAvailability,
  loginDoctor,
} from '../controllers/doctorControllers.js';
import {doctorAuth} from '../middlewares/doctorAuth.js';
import upload from '../middlewares/multer.js';

const doctorRouter = express.Router();

doctorRouter.get("/", getDoctors);
doctorRouter.post('/login', loginDoctor);

doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", upload.single('image'), createDoctor);

// after login, doctor can update their profile
doctorRouter.put("/:id", doctorAuth, upload.single('image'), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleDoctorAvailability);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;

