/**
 * Аутентификация и авторизация
 * Регистрация, вход, выход, Google OAuth
 */

let currentUser = Storage.get('currentUser', null);
let selectedRole = 'student';

// ===== Navigation =====
function updateNav() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    
    if (currentUser) {
        navAuth.classList.add('hidden');
        navUser.classList.remove('hidden');
        
        const initials = currentUser.name[0] + (currentUser.surname ? currentUser.surname[0] : '');
        document.getElementById('userAvatar').textContent = initials;
        document.getElementById('userName').textContent = `${currentUser.name} ${currentUser.surname || ''}`;
        
        // Показать панель университета для вуза
        const universityLink = document.querySelector('.nav-links a[data-page="university-dashboard"]');
        if (currentUser.role === 'university') {
            if (!universityLink) {
                const navLinks = document.getElementById('navLinks');
                const universityItem = document.createElement('a');
                universityItem.href = '#';
                universityItem.dataset.page = 'university-dashboard';
                universityItem.textContent = 'Панель вуза';
                universityItem.onclick = () => showPage('university-dashboard');
                navLinks.appendChild(universityItem);
            }
        } else if (universityLink) {
            universityLink.remove();
        }
    } else {
        navAuth.classList.remove('hidden');
        navUser.classList.add('hidden');
        
        // Убрать ссылку на панель вуза
        const universityLink = document.querySelector('.nav-links a[data-page="university-dashboard"]');
        if (universityLink) universityLink.remove();
    }
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('show');
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

// Закрытие dropdown при клике вне
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-user')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});

// ===== Role Selection =====
function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === role);
    });
    document.getElementById('universityField').style.display = role === 'university' ? 'block' : 'none';
}

// ===== Auth Handlers =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!validateEmail(email)) {
        showToast('Введите корректный email', 'error');
        return;
    }
    
    // Имитация входа
    currentUser = {
        email: email,
        name: 'Иван',
        surname: 'Иванов',
        role: 'student',
        university: 'МГУ им. Ломоносова'
    };
    
    Storage.set('currentUser', currentUser);
    updateNav();
    updateProfile();
    showPage('home');
    showToast('Добро пожаловать!', 'success');
    
    // Очистить форму
    document.getElementById('loginForm').reset();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const surname = document.getElementById('regSurname').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const university = document.getElementById('regUniversity').value || 'Не указан';
    
    if (!name || !email || !password) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showToast('Пароль должен быть минимум 8 символов', 'error');
        return;
    }
    
    currentUser = {
        email: email,
        name: name,
        surname: surname,
        role: selectedRole,
        university: university,
        createdAt: new Date().toISOString()
    };
    
    Storage.set('currentUser', currentUser);
    updateNav();
    updateProfile();
    
    // Переход на нужную страницу
    if (selectedRole === 'university') {
        showPage('university-dashboard');
    } else {
        showPage('profile');
    }
    
    showToast('Аккаунт создан! Добро пожаловать!', 'success');
    
    // Очистить форму
    document.getElementById('registerForm').reset();
}

// ===== Google OAuth (имитация) =====
function handleGoogleLogin() {
    // Имитация входа через Google
    currentUser = {
        email: 'student@gmail.com',
        name: 'Google',
        surname: 'Пользователь',
        role: 'student',
        university: 'МГУ им. Ломоносова',
        fromGoogle: true
    };
    
    Storage.set('currentUser', currentUser);
    updateNav();
    updateProfile();
    showPage('home');
    showToast('Вход через Google выполнен!', 'success');
}

function handleGoogleRegister() {
    handleGoogleLogin();
    showToast('Аккаунт Google привязан!', 'success');
}

function logout() {
    currentUser = null;
    Storage.remove('currentUser');
    updateNav();
    showPage('home');
    showToast('Вы вышли из аккаунта', 'info');
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        currentUser, 
        selectedRole,
        updateNav, 
        toggleUserMenu, 
        toggleMobileMenu,
        selectRole,
        handleLogin, 
        handleRegister, 
        handleGoogleLogin,
        handleGoogleRegister,
        logout
    };
}
