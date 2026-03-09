/**
 * Модель университета
 */
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Название университета обязательно'],
        trim: true,
        unique: true
    },
    
    shortName: {
        type: String,
        trim: true
    },
    
    description: {
        type: String,
        maxlength: [2000, 'Описание не может превышать 2000 символов']
    },
    
    country: {
        type: String,
        required: true,
        enum: ['Узбекистан', 'Казахстан', 'Кыргызстан', 'Таджикистан', 'Россия', 'Турция']
    },
    
    city: {
        type: String,
        required: true
    },
    
    address: String,
    
    website: String,
    
    email: String,
    
    phone: String,
    
    // Рейтинги
    rankings: {
        world: Number,
        region: Number,
        country: Number
    },
    
    // Тип университета
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    
    // Год основания
    foundedYear: Number,
    
    // Языки обучения
    languages: [{
        type: String,
        enum: ['english', 'russian', 'uzbek', 'kazakh', 'kyrgyz', 'turkish']
    }],
    
    // Количество студентов
    studentsCount: {
        total: Number,
        international: Number
    },
    
    // Факультеты/школы
    faculties: [String],
    
    // Изображение
    logo: String,
    coverImage: String,
    
    // Социальные сети
    social: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    
    // Администратор университета
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Индексы
universitySchema.index({ name: 'text' });
universitySchema.index({ country: 1, city: 1 });
universitySchema.index({ status: 1 });

// Виртуальное поле - количество программ
universitySchema.virtual('programsCount', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'university',
    count: true
});

module.exports = mongoose.model('University', universitySchema);
