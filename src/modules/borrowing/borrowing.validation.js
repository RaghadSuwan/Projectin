import joi from "joi";
export const createborrowingValidation = joi.object({
    productId: joi.string().required(), 
    startDate: joi.date().required(),
    endDate: joi.date().min(joi.ref('startDate')).required() 
});

export const cancelborrowingValidation = joi.object({
    borrowingId: joi.string().required(),
});
