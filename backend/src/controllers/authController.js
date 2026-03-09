/**
 * Контроллер аутентификации
 */
const User = require('../models/User');

// @desc    Регистрация
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { email, password, name, surname, role } = req.body;

        // Проверить, существует ли пользователь
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Пользователь с таким email уже существует'
            });
        }

        // Создать пользователя
        const user = await User.create({
            email,
            password,
            name,
            surname,
            role: role || 'student'
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Вход
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверить email и пароль
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                error: 'Неверные учетные данные'
            });
        }

        // Проверить, активен ли аккаунт
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Аккаунт деактивирован'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Вход через Google
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
    try {
        const { googleId, email, name, surname, avatar } = req.body;

        // Искать пользователя по googleId или email
        let user = await User.findOne({ 
            $or: [{ oauthId: googleId }, { email }] 
        });

        if (user) {
            // Обновить данные Google
            if (!user.oauthProvider) {
                user.oauthProvider = 'google';
                user.oauthId = googleId;
                if (avatar) user.profile.avatar = avatar;
                await user.save();
            }
        } else {
            // Создать нового пользователя
            user = await User.create({
                email,
                name,
                surname,
                oauthProvider: 'google',
                oauthId: googleId,
                profile: { avatar }
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Получить текущего пользователя
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('profile.university', 'name');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Обновить профиль
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            surname: req.body.surname,
            'profile.phone': req.body.phone,
            'profile.country': req.body.country,
            'profile.city': req.body.city,
            'profile.faculty': req.body.faculty,
            'profile.course': req.body.course,
            'profile.gpa': req.body.gpa,
            'profile.field': req.body.field
        };

        // Убрать пустые поля
        Object.keys(fieldsToUpdate).forEach(key => 
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Изменить пароль
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Проверить текущий пароль
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'Неверный текущий пароль'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Выход
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {}
    });
};

// Вспомогательная функция для отправки токена
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role,
            profile: user.profile,
            initials: user.initials
        }
    });
};
