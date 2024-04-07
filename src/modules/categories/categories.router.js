import { Router } from 'express';
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subcategoryRouter from '../../modules/subcategory/subcategory.router.js';
const router = Router();
router.use('/:id/subcategory', subcategoryRouter);//use: يعني اي اند بوينت
router.get('/', categoriesController.getCategories);
router.get('/active', categoriesController.getactivecategories);
router.get('/:id', categoriesController.specificcategory);
router.post(
    '/',
    fileUpload(fileValidation.image).single('image'),
    categoriesController.createcategory
);
router.put(
    '/:id',
    fileUpload(fileValidation.image).single('image'),
    categoriesController.updatecategory
);

export default router;
