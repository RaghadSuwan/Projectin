import fileUpload, { fileValidation } from '../../services/multer.js';
import * as AuthController from './auth.controller.js';
import { Router } from 'express';
const router = Router();
router.post(
    '/signup',
    fileUpload(fileValidation.image).single('image'),
    AuthController.SignUp
);
router.post('/signin', AuthController.SignIn);
export default router;

