import { Router } from "express";
import * as productsController from './products.controller.js';
import fileUpload, { fileValidation } from '../../utils/multer.js';
import { endPoint } from "./products.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHanding.js";
import { validation } from '../../middleware/validation.js';
import * as validator from './products.validation .js';
const router = Router();

router.get('/', asyncHandler(productsController.GetProducts));
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 },
]), validation(validator.createProducts), asyncHandler(productsController.CreateProducts));
router.get('/category/:categoryId', asyncHandler(productsController.GetProductWithCategory));
router.get('/:productId', asyncHandler(productsController.GetProduct));

export default router;

