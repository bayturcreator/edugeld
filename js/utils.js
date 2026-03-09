/**
 * Утилиты приложения
 * Вспомогательные функции: уведомления, модальные окна, валидация
 */

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fa-solid ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Modal =====
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Закрытие модального окна по клику вне него
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
    if (e.target.classList.contains('modal') || e.target.closest('.modal-lg')) {
        const modal = document.querySelector('.modal.show:not(#modal)');
        if (modal) modal.classList.remove('show');
    }
});

// ===== Scholarship Modal =====
function closeScholarshipModal() {
    document.getElementById('scholarshipModal').classList.remove('show');
}

// ===== Form Validation =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

// ===== Date Formatting =====
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// ===== Local Storage =====
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
};

// ===== Debounce =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== URL Hash Navigation =====
function handleHashNavigation() {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(`page-${hash}`)) {
        showPage(hash);
    }
}

// Добавить обработчик на изменения hash
window.addEventListener('hashchange', handleHashNavigation);

// Экспорт утилит
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        showToast, 
        showModal, 
        closeModal, 
        validateEmail, 
        validatePassword,
        formatDate,
        formatDateShort,
        Storage,
        debounce
    };
}
