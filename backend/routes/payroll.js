const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, payrollController.getAllPayrolls);
router.get('/my-payroll', auth, payrollController.getMyPayroll);
router.post('/generate', auth, adminAuth, payrollController.generatePayroll);
router.get('/:id/pdf', auth, payrollController.generatePayslipPDF);

module.exports = router;