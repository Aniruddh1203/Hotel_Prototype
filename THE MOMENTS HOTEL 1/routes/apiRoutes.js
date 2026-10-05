const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

/**
 * Authentication Routes
 */
router.post('/auth/login', authController.login);

/**
 * Reservation / Booking Routes
 */
router.post('/bookings', bookingController.createBooking);

module.exports = router;
