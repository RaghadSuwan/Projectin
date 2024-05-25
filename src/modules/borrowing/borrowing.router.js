import { Router } from "express";
import * as borrowingController from './borrowing.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from './borrowing.endPoint.js';
import { asyncHandler } from "../../utils/errorHanding.js";
import { validation } from '../../middleware/validation.js';
import * as validator from './borrowing.validation.js';
const router = Router();


router.post('/', auth(endPoint.create),asyncHandler(borrowingController.Createborrowing));
router.patch('/cancel/:borrowingId', auth(endPoint.delete), asyncHandler(borrowingController.Cancelborrowing));
router.get('/', auth(endPoint.getAll), asyncHandler(borrowingController.Getborrowings));
router.patch('/return/:borrowingId', auth(endPoint.update), asyncHandler(borrowingController.Returnborrowing));

export default router;
