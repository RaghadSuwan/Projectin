import { Router } from "express";
import * as cartController from './cart.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from './cart.endPoint.js';

const router = Router();
router.post('/', auth(endPoint.create), cartController.craeteCart);
router.patch('/removeItem', auth(endPoint.delete), cartController.removeItem);
router.get('/', auth(endPoint.getAll), cartController.getCart);
router.patch('/clearCart', auth(endPoint.clear), cartController.clearCart);

export default router;
