const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// * User Auth Routes
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);

// * Food Partner Auth Routes
router.post('/partner/register', authController.registerFoodPartner);
router.post('/partner/login', authController.loginFoodPartner);
router.get('/partner/logout', authController.logoutFoodPartner);

module.exports = router;