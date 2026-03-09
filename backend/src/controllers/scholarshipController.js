/**
 * Контроллер стипендий
 */
const { Scholarship } = require('../models');

// @desc    Получить все стипендии с фильтрацией
// @route   GET /api/scholarships
// @access  Public
exports.getScholarships = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            country,
            type,
            level,
            field,
            search,
            featured,
            sortBy = 'deadline',
            sortOrder = 'asc'
        } = req.query;

        const query = { status: 'active' };

        if (country) query.country = country;
        if (type) query.type = type;
        if (level) query.level = { $in: [level] };
        if (field) query.field = field;
        if (featured === 'true') query.isFeatured = true;
        
        if (search) {
            query.$text = { $search: search };
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const [scholarships, total] = await Promise.all([
            Scholarship.find(query)
                .select('-criteria -documents -benefits')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Scholarship.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: scholarships.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: scholarships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Получить одну стипендию
// @route   GET /api/scholarships/:id
// @access  Public
exports.getScholarship = async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Стипендия не найдена'
            });
        }

        // Увеличить счётчик просмотров
        scholarship.views += 1;
        await scholarship.save();

        res.status(200).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Создать стипендию
// @route   POST /api/scholarships
// @access  Private (Admin)
exports.createScholarship = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        const scholarship = await Scholarship.create(req.body);

        res.status(201).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Обновить стипендию
// @route   PUT /api/scholarships/:id
// @access  Private (Admin)
exports.updateScholarship = async (req, res) => {
    try {
        let scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Стипендия не найдена'
            });
        }

        scholarship = await Scholarship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Удалить стипендию
// @route   DELETE /api/scholarships/:id
// @access  Private (Admin)
exports.deleteScholarship = async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Стипендия не найдена'
            });
        }

        await scholarship.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Получить избранные стипендии
// @route   GET /api/scholarships/featured
// @access  Public
exports.getFeaturedScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find({
            status: 'active',
            isFeatured: true,
            deadline: { $gt: new Date() }
        })
            .select('name provider country city type amount deadline')
            .limit(6)
            .sort({ deadline: 1 });

        res.status(200).json({
            success: true,
            data: scholarships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
