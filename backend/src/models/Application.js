/**
 * Модель заявки на программу/стипендию
 */
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Тип заявки: программа или стипендия
    targetType: {
        type: String,
        enum: ['program', 'scholarship'],
        required: true
    },
    
    // ID программы или стипендии
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType === program' ? 'Program' : 'Scholarship'
    },
    
    // Статус заявки
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'accepted', 'rejected', 'waitlisted', 'cancelled'],
        default: 'pending'
    },
    
    // Личное заявление
    personalStatement: {
        type: String,
        maxlength: [2000, 'Заявление не может превышать 2000 символов']
    },
    
    // Мотивационное письмо
    motivationLetter: {
        type: String,
        maxlength: [2000]
    },
    
    // Загруженные документы
    documents: [{
        name: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Дополнительные данные
    additionalInfo: {
        type: mongoose.Schema.Types.Mixed
    },
    
    // Оценка (для администратора)
    rating: {
        score: Number,
        comment: String,
        ratedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ratedAt: Date
    },
    
    // История статусов
    statusHistory: [{
        status: String,
        changedAt: {
            type: Date,
            default: Date.now
        },
        comment: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    
    // Дата решения
    decisionDate: Date,
    
    // Комментарий администратора
    adminComment: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Индексы
applicationSchema.index({ student: 1, targetType: 1 });
applicationSchema.index({ targetId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: 1 });

// Виртуальное поле для проверки, может ли студент отменить заявку
applicationSchema.virtual('canCancel').get(function() {
    return ['pending', 'reviewing'].includes(this.status);
});

// Статус текстом
applicationSchema.virtual('statusLabel').get(function() {
    const labels = {
        'pending': 'На рассмотрении',
        'reviewing': 'Проверяется',
        'accepted': 'Принята',
        'rejected': 'Отклонена',
        'waitlisted': 'В листе ожидания',
        'cancelled': 'Отменена'
    };
    return labels[this.status] || this.status;
});

// Добавить запись в историю при изменении статуса
applicationSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
    }
    next();
});

module.exports = mongoose.model('Application', applicationSchema);
