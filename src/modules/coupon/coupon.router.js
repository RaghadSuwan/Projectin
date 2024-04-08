
import { Router } from "express";
import * as CouponController from './coupon.controller.js';
const router = Router();

router.post('/', CouponController.CreateCoupon);
router.get('/', CouponController.GetCoupon);
router.put('/:id', CouponController.UpdateCoupon);

export default router;
