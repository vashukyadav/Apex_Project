const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, employeeController.getAllEmployees);
router.get('/:id', auth, employeeController.getEmployee);
router.post('/', auth, adminAuth, employeeController.createEmployee);
router.put('/:id', auth, adminAuth, employeeController.updateEmployee);
router.delete('/:id', auth, adminAuth, employeeController.deleteEmployee);

module.exports = router;