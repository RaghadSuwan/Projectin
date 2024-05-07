import joi from "joi";
export const createBookingValidation = joi.object({
    productId: joi.string().required(), 
    startDate: joi.date().required(),
    endDate: joi.date().min(joi.ref('startDate')).required() 
});

export const cancelBookingValidation = joi.object({
    bookingId: joi.string().required(),
});
