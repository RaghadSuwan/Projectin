import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const signUp = joi.object({
    userName: joi.string().min(3).max(20).required(),
    email: generalFields.email,
    password: generalFields.password,
    file: generalFields.file
});
export const signIn = joi.object({
    email: generalFields.email,
    password: generalFields.password,
});
export const forgotPassword = joi.object({
    email: generalFields.email,
    password: generalFields.password,
    code:joi.required(),
});
export const sendCode = joi.object({
    email: generalFields.email,
});