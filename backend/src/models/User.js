/**
 * Модель пользователя
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Введите корректный email']
    },
    
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: [8, 'Пароль должен быть минимум 8 символов'],
        select: false
    },
    
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        trim: true
    },
    
    surname: {
        type: String,
        trim: true
    },
    
    role: {
        type: String,
        enum: ['student', 'university', 'admin'],
        default: 'student'
    },
    
    // Для студентов
    profile: {
        avatar: String,
        phone: String,
        dateOfBirth: Date,
        country: String,
        city: String,
        
        // Академия
        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'University'
        },
        faculty: String,
        course: Number,
        gpa: Number,
        
        // Языки
        languages: [{
            name: String,
            level: {
                type: String,
                enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']
            }
        }],
        
        // Достижения
        achievements: [{
            title: String,
            description: String,
            year: Number,
            document: String
        }],
        
        // Специальность
        field: {
            type: String,
            enum: [
                'computer-science',
                'engineering',
                'business',
                'medicine',
                'law',
                'arts',
                'humanities',
                'natural-sciences',
                'social-sciences',
                'economics'
            ]
        }
    },
    
    // Для университетов
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University'
    },
    
    // Статус верификации
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // Статус аккаунта
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Сброс пароля
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // OAuth
    oauthProvider: {
        type: String,
        enum: ['google', 'facebook', null],
        default: null
    },
    oauthId: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Индексы
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.university': 1 });

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Проверка пароля
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Генерация JWT токена
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Полное имя
userSchema.virtual('fullName').get(function() {
    if (this.surname) {
        return `${this.name} ${this.surname}`;
    }
    return this.name;
});

// Инициалы для аватара
userSchema.virtual('initials').get(function() {
    const first = this.name ? this.name[0].toUpperCase() : '';
    const second = this.surname ? this.surname[0].toUpperCase() : '';
    return first + second;
});

module.exports = mongoose.model('User', userSchema);
