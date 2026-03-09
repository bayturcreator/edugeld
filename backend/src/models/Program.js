/**
 * Модель программы обмена/стажировки
 */
const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название программы обязательно'],
        trim: true,
        maxlength: [200, 'Название не может превышать 200 символов']
    },
    
    description: {
        type: String,
        required: [true, 'Описание программы обязательно'],
        maxlength: [2000, 'Описание не может превышать 2000 символов']
    },
    
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    
    type: {
        type: String,
        enum: ['exchange', 'master', 'summer', 'internship'],
        required: true
    },
    
    field: {
        type: String,
        required: true,
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
    
    duration: {
        type: String,
        required: true
    },
    
    language: {
        type: String,
        enum: ['english', 'russian', 'uzbek', 'kazakh', 'kyrgyz', 'turkish'],
        default: 'english'
    },
    
    scholarship: {
        type: String,
        enum: ['full', 'partial', 'none'],
        default: 'none'
    },
    
    amount: {
        type: String,
        default: null
    },
    
    coverage: [{
        type: String,
        enum: ['tuition', 'accommodation', 'living', 'travel', 'insurance']
    }],
    
    deadline: {
        type: Date,
        required: true
    },
    
    startDate: {
        type: Date
    },
    
    requirements: {
        minGPA: Number,
        minAge: Number,
        maxAge: Number,
        requiredLanguages: [String],
        requiredDocuments: [String],
        additionalRequirements: String
    },
    
    seats: {
        type: Number,
        default: 1
    },
    
    status: {
        type: String,
        enum: ['draft', 'active', 'closed', 'archived'],
        default: 'active'
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    views: {
        type: Number,
        default: 0
    },
    
    applications: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Индексы для поиска
programSchema.index({ title: 'text', description: 'text' });
programSchema.index({ university: 1, status: 1 });
programSchema.index({ country: 1, field: 1 });
programSchema.index({ deadline: 1 });
programSchema.index({ type: 1, scholarship: 1 });

// Виртуальное поле для проверки, открыт ли приём
programSchema.virtual('isOpen').get(function() {
    return this.status === 'active' && new Date(this.deadline) > new Date();
});

// Категория программы
programSchema.virtual('category').get(function() {
    const categories = {
        'exchange': 'Программа обмена',
        'master': 'Магистратура',
        'summer': 'Летняя школа',
        'internship': 'Стажировка'
    };
    return categories[this.type];
});

module.exports = mongoose.model('Program', programSchema);
