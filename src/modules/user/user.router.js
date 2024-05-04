import { asyncHandler } from '../../utils/errorHanding.js';
import * as userController from './user.controller.js';
import { auth, roles } from '../../middleware/auth.js';
import { Router } from 'express';
import fileUpload,{ fileValidation } from '../../utils/multer.js';
const router = Router();

router.get('/profile', auth(Object.values(roles)), asyncHandler(userController.GetProfile))
router.post("/uploadUsersExcel",auth(['Admin']),fileUpload(fileValidation.excel).single('file'),asyncHandler(userController.uploadUserExcel))
router.get('/getUsers',asyncHandler(userController.GetUsers));
export default router;

