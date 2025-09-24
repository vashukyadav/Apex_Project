const express = require('express');
const router = express.Router();
const offboardingController = require('../controllers/offboardingController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, adminAuth, offboardingController.getAllOffboardings);
router.post('/', auth, adminAuth, offboardingController.initiateOffboarding);
router.put('/:id', auth, adminAuth, offboardingController.updateOffboarding);
router.put('/:id/complete', auth, adminAuth, offboardingController.completeOffboarding);

module.exports = router;