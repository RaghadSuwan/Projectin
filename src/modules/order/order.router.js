import { Router } from "express";
import * as orderController from './order.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import { endPoint } from "./order.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHanding.js";
const router = Router();

router.post('/',auth(endPoint.create),asyncHandler(orderController.CreateOrder));

export default router;
