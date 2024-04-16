import { Router } from 'express';
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subcategoryRouter from '../../modules/subcategory/subcategory.router.js';
import { auth } from '../../middleware/auth.js';
import { endPoint } from './categories.endPoint.js';
const router = Router();
router.use('/:id/subcategory', subcategoryRouter);//use: يعني اي اند بوينت
router.get('/', auth(endPoint.getAll), categoriesController.getCategories);
router.get('/active', auth(endPoint.gatActive), categoriesController.getactivecategories);
router.get('/:id', auth(endPoint.specific), categoriesController.specificcategory);
router.post(
    '/', auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    categoriesController.createcategory
);
router.put(
    '/:id', auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    categoriesController.updatecategory
);

export default router;
