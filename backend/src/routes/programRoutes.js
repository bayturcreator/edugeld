/**
 * Маршруты программ
 */
const express = require('express');
const router = express.Router();
const { 
    getPrograms, 
    getProgram, 
    createProgram, 
    updateProgram, 
    deleteProgram,
    getProgramStats 
} = require('../controllers/programController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getPrograms)
    .post(protect, authorize('admin', 'university'), createProgram);

router.route('/stats')
    .get(protect, authorize('admin'), getProgramStats);

router.route('/:id')
    .get(getProgram)
    .put(protect, authorize('admin', 'university'), updateProgram)
    .delete(protect, authorize('admin'), deleteProgram);

module.exports = router;
