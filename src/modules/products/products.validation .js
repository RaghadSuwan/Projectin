import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createProducts= joi.object({
    name: joi.string().min(3).max(20).required(),
    description: joi.string().min(2).max(200000).required(),
    stock: joi.number().integer().required(),
    price: joi.number().positive().required(),
    discount: joi.number().positive(),
    categoryId: joi.string().required(),
    subcategoryId: joi.string().required(),
    file: joi.object({
        mainImage: joi.array().items(generalFields.file.required()).length(1),
        subImages: joi.array().items(generalFields.file.required()).min(2).max(5)
    }),
    status: joi.string().valid('Active', 'Inactive'),
   
})
