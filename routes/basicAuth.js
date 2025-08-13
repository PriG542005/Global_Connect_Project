const express = require('express');
const router = express.Router();
const { UserRegisterValidator, LoginValidator,emailValidator } = require('../helpers/validator');
const { loginControllers, userRegister,GenerateOtpForRegister } = require('../controllers/loginControllers')
const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 login requests per window
    message: 'Too many login attempts. Try again in 5 minutes.',
});



router.post('/login', loginRateLimiter, LoginValidator, loginControllers)
router.post('/register', loginRateLimiter,emailValidator, UserRegisterValidator, userRegister)
router.post('/generateVerificationOtp', loginRateLimiter, GenerateOtpForRegister)
module.exports = router;