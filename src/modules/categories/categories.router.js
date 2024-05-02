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
router.get('/', auth(endPoint.getAll), asyncHandler(categoriesController.GetCategories));
router.get('/active', asyncHandler(categoriesController.Getactivecategories));
router.delete('/:categoryId', auth(endPoint.delete), asyncHandler(categoriesController.DeleteCategory));
router.get('/:id', validation(validator.specificCategory), asyncHandler(categoriesController.Specificcategory));
router.post(
    '/', auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'), validation(validator.createCategory)
    , asyncHandler(categoriesController.Createcategory
    ));
router.put(
    '/:id', auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    asyncHandler(categoriesController.Updatecategory
    ));

export default router;
