/**
 * Контроллер программ
 */
const { Program, University } = require('../models');

// @desc    Получить все программы с фильтрацией
// @route   GET /api/programs
// @access  Public
exports.getPrograms = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            country,
            university,
            field,
            type,
            scholarship,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Построение запроса
        const query = { status: 'active' };

        if (country) query.country = country;
        if (university) query.university = university;
        if (field) query.field = field;
        if (type) query.type = type;
        if (scholarship) query.scholarship = scholarship;
        
        // Текстовый поиск
        if (search) {
            query.$text = { $search: search };
        }

        // Сортировка
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Пагинация
        const skip = (page - 1) * limit;

        const [programs, total] = await Promise.all([
            Program.find(query)
                .populate('university', 'name shortName country city')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Program.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: programs.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: programs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Получить одну программу
// @route   GET /api/programs/:id
// @access  Public
exports.getProgram = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id)
            .populate('university', 'name shortName country city website logo')
            .populate('createdBy', 'name email');

        if (!program) {
            return res.status(404).json({
                success: false,
                error: 'Программа не найдена'
            });
        }

        // Увеличить счётчик просмотров
        program.views += 1;
        await program.save();

        res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Создать программу (админ/университет)
// @route   POST /api/programs
// @access  Private (Admin, University)
exports.createProgram = async (req, res) => {
    try {
        // Если пользователь - университет, привязать к нему
        if (req.user.role === 'university') {
            req.body.university = req.user.university;
        }
        
        req.body.createdBy = req.user.id;

        const program = await Program.create(req.body);

        res.status(201).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Обновить программу
// @route   PUT /api/programs/:id
// @access  Private (Admin, University)
exports.updateProgram = async (req, res) => {
    try {
        let program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                error: 'Программа не найдена'
            });
        }

        // Проверка прав (админ или создатель)
        if (req.user.role !== 'admin' && 
            program.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Нет доступа'
            });
        }

        program = await Program.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Удалить программу
// @route   DELETE /api/programs/:id
// @access  Private (Admin)
exports.deleteProgram = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                error: 'Программа не найдена'
            });
        }

        await program.deleteOne();

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

// @desc    Получить статистику программ
// @route   GET /api/programs/stats
// @access  Private (Admin)
exports.getProgramStats = async (req, res) => {
    try {
        const stats = await Program.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalApplications: { $sum: '$applications' }
                }
            }
        ]);

        const byCountry = await Program.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$country',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byType: stats,
                byCountry
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
