const { check } = require('express-validator');
exports.UserRegisterValidator = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail().normalizeEmail(),
    check("password", "Password is required").not().isEmpty().isLength({ min: 6 }),
]


exports.LoginValidator=[
    check("email", "Email is required").not().isEmpty().isEmail().normalizeEmail(),
    check("password", "Password is required").not().isEmpty().isLength({ min: 6 }),
]
exports.emailValidator=[
    check("email", "Email is required").not().isEmpty().isEmail().normalizeEmail(),
]
