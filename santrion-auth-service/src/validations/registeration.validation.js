const joi = require("joi")

// Role to Domain Mapping - backend will use it to set domain automatically
export const roleDomainMap = {
    Patient: "Healthcare",
    Doctor: "Healthcare",
    Nurse: "Healthcare",
    Pathologist: "Healthcare",
    Pharmacist: "Healthcare",
    Admin: "Healthcare",
    FitnessTrainer: "Fitness",
    Dietician: "Fitness",
    Nutritionist: "Fitness"
}

// Registration Validation Schema
const registerValidationSchema = joi.object({
    firstName: joi.string()
        .required()
        .max(50)
        .trim()
        .messages({
            "string.empty": "First name is required",
            "string.max": "First Name must be at most 50 characters",
            "any.required": "First name is required"
        }),
    middleName: joi.string()
        .max(50)
        .trim()
        .allow("")
        .optional()
        .messages({
            "string.max": "Middle Name must be at most 50 characters"
        }),
    lastName: joi.string()
        .required()
        .max(50)
        .trim()
        .messages({
            "string.empty": "Last name is required",
            "string.max": "Last Name must be at most 50 characters",
            "any.required": "Last name is required"
        }),
    username: joi.string()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .required()
        .trim()
        .messages({
            "string.empty": "Username is required",
            "any.required": "Email is required"
        }),
    email: joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            "string.email": "Please provide a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),
    phone: joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .required()
        .trim()
        .messages({
            "string.pattern.base": "Please provide a valid phone number",
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required"
        }),
    password: joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must be at most 128 characters long",
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
            "string.empty": "Password is required",
            "any.required": "Password is required"
        }),
    confirmPassword: joi.string()
        .valid(joi.ref('password'))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "string.empty": "Please confirm your password",
            "any.required": "Please confirm your password"
        }),
    role: joi.string()
        .valid('patient', 'doctor', 'pharmacist', 'pathologist', 'nurse', 'admin', 'fitnesstrainer', 'dietician', 'nutritionist')
        .required()
        .messages({
            "any.only": "Role must be one of: patient, doctor, pharmacist, pathologist, nurse, admin",
            "string.empty": "Role is required",
            "any.required": "Role is required"
        }),
    dateOfBirth: joi.date()
        .max('now')
        .required()
        .messages({
            "date.max": "Date of birth cannot be in the future",
            "date.base": "Please provide a valid date of birth",
            "any.required": "Date of birth is required"
        }),
    gender: joi.string()
        .valid('male', 'female', 'other', 'prefer_not_to_say')
        .required()
        .messages({
            "any.only": "Gender must be one of: male, female, other, prefer_not_to_say",
            "string.empty": "Gender is required",
            "any.required": "Gender is required"
        }),
    address: joi.object({
        streetAddress: joi.string().max(100).required().messages({
            "string.max": "Street address must be at most 100 characters",
            "string.empty": "Street address is required",
            "any.required": "Street address is required"
        }),
        cityName: joi.string().max(50).required().messages({
            "string.max": "City must be at most 50 characters",
            "string.empty": "City is required",
            "any.required": "City is required"
        }),
        stateName: joi.string().max(50).required().messages({
            "string.max": "State must be at most 50 characters",
            "string.empty": "State is required",
            "any.required": "State is required"
        }),
        countryName: joi.string().max(50).required().messages({
            "string.max": "Country must be at most 50 characters",
            "string.empty": "Country is required",
            "any.required": "Country is required"
        }),
        pinCode: joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
            "string.pattern.base": "Please provide a valid ZIP code",
            "string.empty": "ZIP code is required",
            "any.required": "ZIP code is required"
        })
    }).required().messages({
        "any.required": "Address is required"
    }),
    termsAccepted: joi.boolean()
        .valid(true)
        .required()
        .messages({
            "any.only": "You must accept the terms and conditions",
            "any.required": "You must accept the terms and conditions"
        }),
    privacyPolicyAccepted: joi.boolean()
        .valid(true)
        .required()
        .messages({
            "any.only": "You must accept the privacy policy",
            "any.required": "You must accept the privacy policy"
        }),
    
    // Domain is not expected from frontend
    domain: joi.forbidden()
})

module.exports = {
    registerValidationSchema,
    roleDomainMap
}