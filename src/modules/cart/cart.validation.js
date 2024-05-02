import joi from "joi";

export const createCart = joi.object({
    quantity: joi.number().min(1).required()
})