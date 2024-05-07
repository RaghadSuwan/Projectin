import { asyncHandler } from "../../utils/errorHanding.js";
import * as userController from "./user.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { Router } from "express";
import fileUpload, { fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./user.validation.js";
import { endPoint } from "./user.endPoint.js";
const router = Router();

router.get(
    "/profile",
    auth(Object.values(roles)),
    asyncHandler(userController.GetProfile)
);
router.post(
    "/uploadUsersExcel",
    auth(endPoint.uploadUserExcel), fileUpload(fileValidation.excel).single("file"),
    asyncHandler(userController.uploadUserExcel)
);
router.get("/getUsers", auth(endPoint.getUsers), asyncHandler(userController.GetUsers));
router.patch(
    "/updatePassword",
    auth(Object.values(roles)),
    validation(validator.updatePassword),
    asyncHandler(userController.UpdatePassword)
);
export default router;

