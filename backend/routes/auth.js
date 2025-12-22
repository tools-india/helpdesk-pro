const express = require('express');
const router = express.Router();
const {
    register,
    login,
    verifyOTP,
    verifyEmail,
    getMe,
    resendOTP
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, getMe);

module.exports = router;
