import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
    file: generalFields.file.required(),
});
export const specificCategory = joi.object({
    id: joi.string().min(24).max(24).required(),
});