import fileUpload, { fileValidation } from '../../services/multer.js';
import * as AuthController from './auth.controller.js';
import { Router } from 'express';
const router = Router();
router.post(
    '/signup',
    fileUpload(fileValidation.image).single('image'),
    AuthController.SignUp
);
router.get('/confirmEmail/:token', AuthController.confirmEmail);
router.post('/signin', AuthController.SignIn);
router.patch('/sendCode',AuthController.sendCode);
router.patch('/forgotPassword',AuthController.forgotPassword);

export default router;

