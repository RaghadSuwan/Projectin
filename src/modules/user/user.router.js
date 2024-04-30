import { asyncHandler } from '../../utils/errorHanding.js';
import * as userController from './user.controller.js';
import { auth, roles } from '../../middleware/auth.js';
import { Router } from 'express';
const router = Router();
router.get('/profile', auth(Object.values(roles)), asyncHandler(userController.getProfile))

export default router;

