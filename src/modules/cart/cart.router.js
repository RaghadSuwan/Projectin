import { Router } from "express";
import * as cartController from './cart.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from './cart.endPoint.js';
import { asyncHandler } from "../../utils/errorHanding.js";
const router = Router();

router.post('/', auth(endPoint.create), asyncHandler(cartController.CraeteCart));
router.patch('/removeItem', auth(endPoint.delete), asyncHandler(cartController.RemoveItem));
router.get('/', auth(endPoint.getAll), asyncHandler(cartController.GetCart));
router.patch('/clearCart', auth(endPoint.clear), asyncHandler(cartController.ClearCart));

export default router;
