import { Router } from "express";
import * as bookingController from './booking.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from './booking.endPoint.js';
import { asyncHandler } from "../../utils/errorHanding.js";
import { validation } from '../../middleware/validation.js';
import * as validator from './categories.validation .js';const router = Router();


router.post('/', auth(endPoint.create), createBookingValidation, asyncHandler(bookingController.CreateBooking));
router.delete('/', auth(endPoint.delete), cancelBookingValidation, asyncHandler(bookingController.CancelBooking));
router.get('/', auth(endPoint.getAll), asyncHandler(bookingController.GetBookings));
router.patch('/return', auth(endPoint.update), returnBookingValidation, asyncHandler(bookingController.ReturnBooking));

export default router;
