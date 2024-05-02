import { Router } from 'express';
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../utils/multer.js';
import subcategoryRouter from '../../modules/subcategory/subcategory.router.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './categories.endPoint.js';
import { asyncHandler } from '../../utils/errorHanding.js';
import { validation } from '../../middleware/validation.js';
import * as validator from './categories.validation .js';
const router = Router();

router.use('/:id/subcategory', subcategoryRouter);
router.get('/', auth(endPoint.getAll), asyncHandler(categoriesController.getCategories));
router.get('/active', asyncHandler(categoriesController.getactivecategories));
router.delete('/:categoryId', auth(endPoint.delete), asyncHandler(categoriesController.deleteCategory));
router.get('/:id', validation(validator.specificCategory), asyncHandler(categoriesController.specificcategory));
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
