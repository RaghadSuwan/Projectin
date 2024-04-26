import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const create = joi.object({
    name: joi.string().min(3).max(20).required(),
    file: generalFields.file.required(),
});
