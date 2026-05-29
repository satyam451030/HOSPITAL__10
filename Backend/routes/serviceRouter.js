import express from 'express';
import multer from 'multer';

import { createService, getAllServices, getServiceById, updateService, deleteService } from '../controllers/serviceController.js';

const upload = multer({ dest: 'temp/' });
const serviceRouter = express.Router();

serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.post("/", upload.single('image'), createService);
serviceRouter.put("/:id", upload.single('image'), updateService);
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;