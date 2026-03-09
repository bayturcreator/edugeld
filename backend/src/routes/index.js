/**
 * Главный файл маршрутов
 */
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const programRoutes = require('./programRoutes');
const scholarshipRoutes = require('./scholarshipRoutes');
const applicationRoutes = require('./applicationRoutes');

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);
router.use('/scholarships', scholarshipRoutes);
router.use('/applications', applicationRoutes);

// Тестовый маршрут
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'StudentConnect API работает!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
