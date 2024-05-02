import { asyncHandler } from '../../utils/errorHanding.js';
import fileUpload, { fileValidation } from '../../utils/multer.js';
import * as SubCategory from './subcategory.controller.js';
import { Router } from 'express';
const router = Router({ mergeParams: true });

router.post(
    '/',
    fileUpload(fileValidation.image).single('image'),
    asyncHandler(SubCategory.CreateSubCategory));
router.get('/', asyncHandler(SubCategory.GetSubCategories));

export default router;
