import { asyncHandler } from '../../services/errorHanding.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import * as AuthController from './auth.controller.js';
import { Router } from 'express';
const router = Router();
router.post(
    '/signup',
    fileUpload(fileValidation.image).single('image'),
    asyncHandler(AuthController.SignUp)
);
router.get('/confirmEmail/:token', asyncHandler(AuthController.confirmEmail));
router.post('/signin', asyncHandler(AuthController.SignIn));
router.patch('/sendCode', asyncHandler(AuthController.sendCode));
router.patch('/forgotPassword', asyncHandler(AuthController.forgotPassword));

export default router;

