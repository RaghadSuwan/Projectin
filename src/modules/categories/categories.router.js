import { Router } from 'express';
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subcategoryRouter from '../../modules/subcategory/subcategory.router.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './categories.endPoint.js';
import { asyncHandler } from '../../services/errorHanding.js';
import { validation } from '../../middleware/validation.js';
import * as validator from './categories.validation .js';

const router = Router();
router.use('/:id/subcategory', subcategoryRouter);//use: يعني اي اند بوينت
router.get('/', auth(endPoint.getAll), asyncHandler(categoriesController.getCategories));
router.get('/active', auth(endPoint.gatActive), asyncHandler(categoriesController.getactivecategories));
router.get('/:id', auth(endPoint.specific), validation(validator.specificCategory), asyncHandler(categoriesController.specificcategory));
router.post(
    '/', auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'), validation(validator.createCategory)
    , asyncHandler(categoriesController.createcategory
    ));
router.put(
    '/:id', auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    asyncHandler(categoriesController.updatecategory
    ));

export default router;
