const express =require("express");
const router =express.Router();
const {register, login, logout, getUser} = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Get User
router.get('/user', getUser)

module.exports = router;