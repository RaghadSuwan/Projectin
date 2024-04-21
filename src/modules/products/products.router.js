import { Router } from "express";
import * as productsController from './products.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import { endPoint } from "./products.endPoint.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.get('/', productsController.getProducts);
router.post('/', auth(endPoint.create), (req, res, next) => {
    console.log("Request body:", req.body); // Log the request body
    next(); // Call next middleware
}, fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 },
]), productsController.createProducts);
export default router;
