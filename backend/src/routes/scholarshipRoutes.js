/**
 * Маршруты стипендий
 */
const express = require('express');
const router = express.Router();
const { 
    getScholarships, 
    getScholarship, 
    createScholarship, 
    updateScholarship, 
    deleteScholarship,
    getFeaturedScholarships 
} = require('../controllers/scholarshipController');
const { protect, authorize } = require('../middleware/auth');

router.get('/featured', getFeaturedScholarships);

router.route('/')
    .get(getScholarships)
    .post(protect, authorize('admin'), createScholarship);

router.route('/:id')
    .get(getScholarship)
    .put(protect, authorize('admin'), updateScholarship)
    .delete(protect, authorize('admin'), deleteScholarship);

module.exports = router;
