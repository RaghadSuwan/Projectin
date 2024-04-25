import Joi from 'joi';
export const generalFields = {
    email: Joi.string().email().required().min(5).messages({
        'string.empty': "Email is required",
        'string.email': "Please enter a valid email"
    }),

    password: Joi.string().required().min(3).messages({
        'string.empty': "Password is required",
        'string.min': "Password should have a minimum length of {#limit} characters"
    }),

    file: Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required(),
        dest: Joi.string(),
    })
};

export const validation = (schema) => {
    return (req, res, next) => {
        const inputsData = { ...req.body, ...req.params, ...req.query};
        if (req.file || req.files) {
            inputsData.file = req.file || req.files;
        }
        const validationResult = schema.validate(inputsData, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json({
                message: "Validation error",
                validationError: validationResult.error.details
            });
        }
        next();
    }
};