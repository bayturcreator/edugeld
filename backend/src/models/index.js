/**
 * Экспорт всех моделей
 */
const User = require('./User');
const University = require('./University');
const Program = require('./Program');
const Scholarship = require('./Scholarship');
const Application = require('./Application');

module.exports = {
    User,
    University,
    Program,
    Scholarship,
    Application
};
