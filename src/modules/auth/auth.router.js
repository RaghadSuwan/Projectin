import { asyncHandler } from '../../utils/errorHanding.js';
import fileUpload, { fileValidation } from '../../utils/multer.js';
import * as AuthController from './auth.controller.js';
import { validation } from '../../middleware/validation.js';
import * as validator from './auth.validation.js';
import { Router } from 'express';
const router = Router();

router.post(
    '/signup',
    fileUpload(fileValidation.image).single('image'),
    validation(validator.signUp),
    asyncHandler(AuthController.SignUp)
);
router.get('/confirmEmail/:token', asyncHandler(AuthController.ConfirmEmail));
router.post('/signin', validation(validator.signIn), asyncHandler(AuthController.SignIn));
router.patch('/sendCode', validation(validator.sendCode), asyncHandler(AuthController.SendCode));
router.patch('/forgotPassword', validation(validator.forgotPassword), asyncHandler(AuthController.ForgotPassword));
router.delete("/deleteUnconfirmed", asyncHandler(AuthController.DeleteUnConfirmedUsers));

export default router;

