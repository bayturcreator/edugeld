/**
 * Контроллер заявок
 */
const { Application, Program, Scholarship } = require('../models');

// @desc    Подать заявку на программу
// @route   POST /api/applications
// @access  Private (Student)
exports.applyToProgram = async (req, res) => {
    try {
        const { programId, personalStatement, motivationLetter } = req.body;

        // Проверить, существует ли программа
        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({
                success: false,
                error: 'Программа не найдена'
            });
        }

        // Проверить, не подавал ли уже заявку
        const existingApplication = await Application.findOne({
            student: req.user.id,
            targetType: 'program',
            targetId: programId,
            status: { $nin: ['rejected', 'cancelled'] }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'Вы уже подали заявку на эту программу'
            });
        }

        // Создать заявку
        const application = await Application.create({
            student: req.user.id,
            targetType: 'program',
            targetId: programId,
            personalStatement,
            motivationLetter,
            statusHistory: [{ status: 'pending' }]
        });

        // Увеличить счётчик заявок у программы
        await Program.findByIdAndUpdate(programId, {
            $inc: { applications: 1 }
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Подать заявку на стипендию
// @route   POST /api/applications/scholarship
// @access  Private (Student)
exports.applyToScholarship = async (req, res) => {
    try {
        const { scholarshipId, personalStatement, motivationLetter } = req.body;

        // Проверить, существует ли стипендия
        const scholarship = await Scholarship.findById(scholarshipId);
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Стипендия не найдена'
            });
        }

        // Проверить, не подавал ли уже заявку
        const existingApplication = await Application.findOne({
            student: req.user.id,
            targetType: 'scholarship',
            targetId: scholarshipId,
            status: { $nin: ['rejected', 'cancelled'] }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'Вы уже подали заявку на эту стипендию'
            });
        }

        // Создать заявку
        const application = await Application.create({
            student: req.user.id,
            targetType: 'scholarship',
            targetId: scholarshipId,
            personalStatement,
            motivationLetter,
            statusHistory: [{ status: 'pending' }]
        });

        // Увеличить счётчик заявок у стипендии
        await Scholarship.findByIdAndUpdate(scholarshipId, {
            $inc: { applications: 1 }
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Получить мои заявки
// @route   GET /api/applications/my
// @access  Private (Student)
exports.getMyApplications = async (req, res) => {
    try {
        const { status, targetType, page = 1, limit = 10 } = req.query;

        const query = { student: req.user.id };
        if (status) query.status = status;
        if (targetType) query.targetType = targetType;

        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
            Application.find(query)
                .populate('targetId', 'title name amount university provider')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Application.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Получить заявки для программы/стипендии
// @route   GET /api/applications/target/:type/:id
// @access  Private (Admin, University)
exports.getTargetApplications = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        const query = { 
            targetType: type,
            targetId: id
        };
        
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
            Application.find(query)
                .populate('student', 'name surname email profile')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Application.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Обновить статус заявки
// @route   PUT /api/applications/:id/status
// @access  Private (Admin)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, comment } = req.body;

        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate('targetId', 'title name');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Заявка не найдена'
            });
        }

        application.status = status;
        application.adminComment = comment;
        
        if (['accepted', 'rejected'].includes(status)) {
            application.decisionDate = new Date();
        }

        await application.save();

        // TODO: Отправить уведомление студенту

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Отменить свою заявку
// @route   DELETE /api/applications/:id
// @access  Private (Student)
exports.cancelApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Заявка не найдена'
            });
        }

        // Проверить, что заявка принадлежит пользователю
        if (application.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Нет доступа'
            });
        }

        if (!application.canCancel) {
            return res.status(400).json({
                success: false,
                error: 'Заявку нельзя отменить'
            });
        }

        application.status = 'cancelled';
        await application.save();

        // Уменьшить счётчик заявок
        const model = application.targetType === 'program' ? Program : Scholarship;
        await model.findByIdAndUpdate(application.targetId, {
            $inc: { applications: -1 }
        });

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
