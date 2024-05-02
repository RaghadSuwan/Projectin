import { Router } from "express";
import * as orderController from './order.controller.js';
import { endPoint } from "./order.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHanding.js";
const router = Router();

router.get('/', auth(endPoint.getAll), asyncHandler(orderController.GetOrders))
router.post('/',auth(endPoint.create),asyncHandler(orderController.CreateOrder));
router.patch('/cancel/:orderId', auth(endPoint.cancelOrder), asyncHandler(orderController.CancelOrder));
router.patch('/changeStatus/:orderId', auth(endPoint.changeOrderStatus), asyncHandler(orderController.ChangeOrderStatus));
export default router;
