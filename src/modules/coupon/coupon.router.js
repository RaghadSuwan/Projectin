
import { Router } from "express";
import * as CouponController from './coupon.controller.js';
import { asyncHandler } from "../../services/errorHanding.js";
const router = Router();

router.post('/', asyncHandler(CouponController.CreateCoupon));
router.get('/', asyncHandler(CouponController.GetCoupon));
router.put('/:id', asyncHandler(CouponController.UpdateCoupon));
router.patch('/softDelete/:id', asyncHandler(CouponController.SoftDelete));
router.delete('/hardDelete/:id', asyncHandler(CouponController.HardDelete));
router.patch('/restore/:id', asyncHandler(CouponController.Restore));

export default router;
