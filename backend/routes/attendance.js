const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, attendanceController.getAllAttendance);
router.get('/my-attendance', auth, attendanceController.getMyAttendance);
router.post('/checkin', auth, attendanceController.checkIn);
router.put('/checkout', auth, attendanceController.checkOut);

module.exports = router;