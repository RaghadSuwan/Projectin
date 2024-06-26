import joi from 'joi';

export const createCoupon = joi.object({
    name: joi.string().min(3).max(20).required(),
    amount: joi.number().positive(),
    expireDate: joi.date().greater('now').required(),
});
