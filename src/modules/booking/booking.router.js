import { Router } from "express";
import * as bookingController from './booking.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from './booking.endPoint.js';
import { asyncHandler } from "../../utils/errorHanding.js";
import { validation } from '../../middleware/validation.js';
import * as validator from './booking.validation.js';
const router = Router();


// router.post('/', auth(endPoint.create),asyncHandler(bookingController.CreateBooking));
// router.patch('/cancel/:bookingId', auth(endPoint.delete), asyncHandler(bookingController.CancelBooking));
// router.get('/', auth(endPoint.getAll), asyncHandler(bookingController.GetBookings));
// router.patch('/return/:bookingId', auth(endPoint.update), asyncHandler(bookingController.ReturnBooking));

export default router;
