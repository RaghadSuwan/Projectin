import { asyncHandler } from '../../utils/errorHanding.js';
import * as reviewController from './review.controller.js';
import { endPoint } from "./review.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { Router } from 'express';

const router = Router({ mergeParams: true });

router.post("/", auth(endPoint.create), asyncHandler(reviewController.create));

export default router;
