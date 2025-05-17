const express = require('express');
const router = express.Router();
const authController = require('../Controller/authControllers');
const authenticate = require('../Middleware/authMiddleware');

// Route for user registration or creation
router.post('/register', authController.getRegister);

// Route for user login
router.post('/login', authController.getLogin);

// Route for user logout
router.get('/logout', authController.getLogout);

// Route for user profile
router.get('/profile', authenticate.authenticate,authController.getProfile);



module.exports = router;