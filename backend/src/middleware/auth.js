/**
 * Middleware для защиты маршрутов
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Защита маршрутов - требует авторизации
exports.protect = async (req, res, next) => {
    let token;

    // Проверить заголовок Authorization
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Не авторизован'
        });
    }

    try {
        // Верифицировать токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Найти пользователя
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Пользователь не найден'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Не авторизован'
        });
    }
};

// Проверка роли
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Нет доступа'
            });
        }
        next();
    };
};

// Проверка, что пользователь верифицирован
exports.isVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({
            success: false,
            error: 'Требуется верификация аккаунта'
        });
    }
    next();
};
