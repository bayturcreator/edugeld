/**
 * Модель стипендии/гранта
 */
const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Название стипендии обязательно'],
        trim: true,
        maxlength: [200, 'Название не может превышать 200 символов']
    },
    
    provider: {
        type: String,
        required: [true, 'Организатор обязателен'],
        trim: true
    },
    
    description: {
        type: String,
        required: [true, 'Описание обязательно'],
        maxlength: [3000, 'Описание не может превышать 3000 символов']
    },
    
    type: {
        type: String,
        enum: ['full', 'partial', 'grant'],
        required: true
    },
    
    level: [{
        type: String,
        enum: ['bachelor', 'master', 'phd', 'postdoc', 'professional']
    }],
    
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
            'economics',
            'any'
        ]
    },
    
    country: {
        type: String,
        required: true,
        enum: ['Узбекистан', 'Казахстан', 'Кыргызстан', 'Таджикистан', 'Россия', 'Турция', 'any']
    },
    
    city: {
        type: String
    },
    
    amount: {
        type: String,
        required: true
    },
    
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'RUB', 'KZT', 'UZS', 'TRY'],
        default: 'USD'
    },
    
    duration: {
        type: String,
        required: true
    },
    
    coverage: [{
        type: String,
        enum: ['tuition', 'accommodation', 'living', 'travel', 'insurance', 'visa']
    }],
    
    deadline: {
        type: Date,
        required: true
    },
    
    startDate: {
        type: Date
    },
    
    eligibility: {
        countries: [String],
        minAge: Number,
        maxAge: Number,
        minGPA: Number,
        requiredLanguages: [String],
        citizenship: [String],
        otherRequirements: String
    },
    
    criteria: [{
        type: String
    }],
    
    documents: [{
        type: String,
        required: true
    }],
    
    benefits: [{
        type: String
    }],
    
    officialLink: {
        type: String
    },
    
    seats: {
        type: Number,
        default: 10
    },
    
    status: {
        type: String,
        enum: ['draft', 'active', 'closed', 'archived'],
        default: 'active'
    },
    
    isFeatured: {
        type: Boolean,
        default: false
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

// Индексы
scholarshipSchema.index({ name: 'text', description: 'text' });
scholarshipSchema.index({ country: 1, type: 1 });
scholarshipSchema.index({ deadline: 1 });
scholarshipSchema.index({ level: 1, field: 1 });
scholarshipSchema.index({ status: 1, isFeatured: 1 });

// Виртуальные поля
scholarshipSchema.virtual('isOpen').get(function() {
    return this.status === 'active' && new Date(this.deadline) > new Date();
});

scholarshipSchema.virtual('typeLabel').get(function() {
    const labels = {
        'full': 'Полная',
        'partial': 'Частичная',
        'grant': 'Грант'
    };
    return labels[this.type];
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
