/**
 * Маршруты заявок
 */
const express = require('express');
const router = express.Router();
const { 
    applyToProgram,
    applyToScholarship,
    getMyApplications,
    getTargetApplications,
    updateApplicationStatus,
    cancelApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Маршруты для студентов
router.post('/program', protect, applyToProgram);
router.post('/scholarship', protect, applyToScholarship);
router.get('/my', protect, getMyApplications);
router.delete('/:id', protect, cancelApplication);

// Маршруты для админов и университетов
router.get('/target/:type/:id', protect, authorize('admin', 'university'), getTargetApplications);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
