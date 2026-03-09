/**
 * Функции рендеринга
 * Все функции для отображения данных на странице
 */

// Данные пользователя
let userData = Storage.get('userData', {
    achievements: [
        { title: 'Победитель хакатона', description: '1 место на TechCrunch Hackathon 2023', icon: 'fa-trophy' },
        { title: 'Публикация', description: 'Статья в научном журнале', icon: 'fa-book' },
    ],
    languages: [
        { name: 'Английский', level: 'B2', percentage: 75 },
        { name: 'Немецкий', level: 'A2', percentage: 40 },
    ],
    gpa: 4.5,
    course: 3,
    faculty: 'Компьютерные науки',
    favorites: [],
    applications: []
});

// ===== Programs =====
function renderFeaturedPrograms() {
    const container = document.getElementById('featuredPrograms');
    if (!container) return;
    container.innerHTML = programs.slice(0, 3).map(createProgramCard).join('');
}

function renderPrograms() {
    const container = document.getElementById('programsGrid');
    if (!container) return;
    container.innerHTML = programs.map(createProgramCard).join('');
}

function createProgramCard(program) {
    const isFavorite = userData.favorites.includes(program.id);
    return `
        <div class="program-card">
            <div class="program-image" style="background: linear-gradient(135deg, #667eea, #764ba2)">
                <i class="fa-solid fa-graduation-cap"></i>
                ${program.scholarship === 'full' ? '<span class="program-badge scholarship"><i class="fa-solid fa-trophy"></i> Стипендия</span>' : ''}
            </div>
            <div class="program-content">
                <p class="program-university">${program.university}</p>
                <h3 class="program-title">${program.title}</h3>
                <div class="program-meta">
                    <span><i class="fa-solid fa-clock"></i> ${program.duration}</span>
                    <span><i class="fa-solid fa-calendar"></i> До ${formatDateShort(program.deadline)}</span>
                </div>
                <div class="program-footer">
                    <span class="scholarship-amount">${program.amount}</span>
                    <div class="program-actions">
                        <button class="btn-icon" onclick="toggleFavorite(${program.id})" title="В избранное">
                            <i class="fa-solid fa-heart${isFavorite ? '' : '-o'}"></i>
                        </button>
                        <button class="btn-primary btn-sm" onclick="applyToProgram(${program.id})">Подать</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function filterPrograms() {
    const search = document.getElementById('programSearch')?.value.toLowerCase() || '';
    const university = document.getElementById('filterUniversity')?.value || '';
    const duration = document.getElementById('filterDuration')?.value || '';
    const scholarship = document.getElementById('filterScholarship')?.value || '';
    
    const filtered = programs.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search) || p.university.toLowerCase().includes(search);
        const matchUniversity = !university || p.university === university;
        const matchDuration = !duration || p.duration.includes(duration === '1year' ? 'год' : duration);
        const matchScholarship = !scholarship || p.scholarship === scholarship;
        return matchSearch && matchUniversity && matchDuration && matchScholarship;
    });
    
    const container = document.getElementById('programsGrid');
    if (container) {
        container.innerHTML = filtered.length ? filtered.map(createProgramCard).join('') : '<p class="no-results">Программы не найдены</p>';
    }
}

function populateUniversityFilters() {
    const select = document.getElementById('filterUniversity');
    if (!select) return;
    
    const uniqueUniversities = [...new Set(programs.map(p => p.university))];
    select.innerHTML = '<option value="">Все университеты</option>' + 
        uniqueUniversities.map(u => `<option value="${u}">${u}</option>`).join('');
}

// ===== Universities =====
function renderUniversities() {
    const container = document.getElementById('universitiesGrid');
    if (!container) return;
    
    container.innerHTML = universities.map(uni => `
        <div class="university-card" onclick="showUniversityDetail(${uni.id})">
            <div class="university-image" style="background: ${uni.image}">
                <i class="fa-solid fa-building-columns"></i>
            </div>
            <div class="university-content">
                <h3 class="university-name">${uni.name}</h3>
                <p class="university-location"><i class="fa-solid fa-location-dot"></i> ${uni.location}</p>
                <div class="university-stats">
                    <div class="university-stat">
                        <span class="university-stat-number">${uni.programs}</span>
                        <span class="university-stat-label">Программ</span>
                    </div>
                    <div class="university-stat">
                        <span class="university-stat-number">${uni.students}</span>
                        <span class="university-stat-label">Студентов</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showUniversityDetail(id) {
    const uni = universities.find(u => u.id === id);
    if (!uni) return;
    
    showModal(uni.name, `
        <div class="university-detail">
            <div class="detail-section">
                <p><strong>Расположение:</strong> ${uni.location}</p>
                <p><strong>Программ:</strong> ${uni.programs}</p>
                <p><strong>Студентов:</strong> ${uni.students}</p>
            </div>
            <button class="btn-primary btn-full" onclick="closeModal(); showPage('programs')">
                Смотреть программы
            </button>
        </div>
    `);
}

// ===== Scholarships =====
function renderScholarships(filter = 'all') {
    const container = document.getElementById('scholarshipsGrid');
    if (!container) return;
    container.innerHTML = scholarships.map(createScholarshipCard).join('');
}

function createScholarshipCard(scholarship) {
    const typeLabels = { full: 'Полная', partial: 'Частичная', grant: 'Грант' };
    const typeClasses = { full: 'full', partial: 'partial', grant: 'grant' };
    
    // Если это стипендия ОРХУН - добавить специальный бейдж
    const orhunBadge = scholarship.isOrhun ? '<span class="orhun-mini-badge">🎓 ОРХУН</span>' : '';
    
    return `
        <div class="scholarship-card" onclick="showScholarshipDetail(${scholarship.id})">
            <div class="scholarship-header">
                <div class="scholarship-type-badge ${typeClasses[scholarship.type]}">${typeLabels[scholarship.type]}</div>
                ${orhunBadge}
                <button class="btn-icon" onclick="event.stopPropagation(); toggleScholarshipFavorite(${scholarship.id})">
                    <i class="fa-solid fa-heart-o"></i>
                </button>
            </div>
            <h3 class="scholarship-title">${scholarship.name}</h3>
            <p class="scholarship-provider"><i class="fa-solid fa-building"></i> ${scholarship.provider}</p>
            <p class="scholarship-location"><i class="fa-solid fa-location-dot"></i> ${scholarship.city}, ${scholarship.country}</p>
            <div class="scholarship-amount">${scholarship.amount}</div>
            <div class="scholarship-meta">
                <span><i class="fa-solid fa-clock"></i> До ${formatDateShort(scholarship.deadline)}</span>
                <span><i class="fa-solid fa-graduation-cap"></i> ${scholarship.level.join(', ')}</span>
            </div>
            <div class="scholarship-coverage">
                ${scholarship.coverage.map(c => `<span class="coverage-tag">${c}</span>`).join('')}
            </div>
            <button class="btn-primary btn-sm btn-full">Подробнее</button>
        </div>
    `;
}

function filterScholarships(category) {
    const search = document.getElementById('scholarshipSearch')?.value.toLowerCase() || '';
    const country = document.getElementById('filterScholarshipCountry')?.value || '';
    const level = document.getElementById('filterScholarshipLevel')?.value || '';
    
    // Обновить активную кнопку категории
    if (category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
    } else {
        category = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    }
    
    const filtered = scholarships.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search) || s.provider.toLowerCase().includes(search);
        const matchCountry = !country || s.country === country;
        const matchLevel = !level || s.level.includes(level);
        const matchCategory = category === 'all' || s.type === category;
        return matchSearch && matchCountry && matchLevel && matchCategory;
    });
    
    const container = document.getElementById('scholarshipsGrid');
    if (container) {
        container.innerHTML = filtered.length ? filtered.map(createScholarshipCard).join('') : '<p class="no-results">Стипендии не найдены</p>';
    }
}

function showScholarshipDetail(id) {
    const s = scholarships.find(sch => sch.id === id);
    if (!s) return;
    
    const typeLabels = { full: 'Полная', partial: 'Частичная', grant: 'Грант' };
    
    // Если это стипендия ОРХУН - добавить статистику и рейтинг
    let orhunSection = '';
    if (s.isOrhun && s.stats) {
        orhunSection = `
            <div class="orhun-detail-stats">
                <div class="orhun-stat-box">
                    <span class="stat-num">${s.stats.applications}</span>
                    <span class="stat-label">Заявок подано</span>
                </div>
                <div class="orhun-stat-box">
                    <span class="stat-num">${s.stats.seats}</span>
                    <span class="stat-label">Мест</span>
                </div>
                <div class="orhun-stat-box">
                    <span class="stat-num">${s.stats.deadline}</span>
                    <span class="stat-label">Дедлайн</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-chart-bar"></i> Рейтинг абитуриентов (GPA)</h4>
                <div class="rating-chart">
                    ${s.rating.map(r => `
                        <div class="rating-bar">
                            <div class="rating-label">${r.range}</div>
                            <div class="rating-progress">
                                <div class="rating-fill ${r.percent >= 35 ? 'high' : r.percent >= 20 ? 'medium' : 'low'}" style="width: ${r.percent}%"></div>
                            </div>
                            <div class="rating-count">${r.count} чел.</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-user-clock"></i> Недавно подавшие заявки</h4>
                <div class="orhun-applicants-grid">
                    ${s.recentApplicants.map(app => `
                        <div class="orhun-applicant-mini">
                            <span class="app-avatar">${app.name[0]}</span>
                            <span class="app-name">${app.name}</span>
                            <span class="app-gpa">GPA ${app.gpa}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('scholarshipModalTitle').textContent = s.name;
    document.getElementById('scholarshipModalBody').innerHTML = `
        <div class="scholarship-detail">
            <div class="detail-header">
                <span class="scholarship-type-badge ${s.type}">${typeLabels[s.type]}</span>
                <span class="detail-amount">${s.amount}</span>
            </div>
            
            ${orhunSection}
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-info-circle"></i> Описание</h4>
                <p>${s.description}</p>
            </div>
            
            <div class="detail-grid">
                <div class="detail-item">
                    <i class="fa-solid fa-building"></i>
                    <div><label>Организатор</label><span>${s.provider}</span></div>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <div><label>Локация</label><span>${s.city}, ${s.country}</span></div>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-clock"></i>
                    <div><label>Длительность</label><span>${s.duration}</span></div>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-calendar"></i>
                    <div><label>Дедлайн</label><span>${formatDate(s.deadline)}</span></div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-check-list"></i> Что входит</h4>
                <div class="benefits-list">
                    ${s.benefits.map(b => `<span class="benefit-tag"><i class="fa-solid fa-check"></i> ${b}</span>`).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-clipboard-list"></i> Критерии отбора</h4>
                <ul class="criteria-list">
                    ${s.criteria.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-file-lines"></i> Документы</h4>
                <ul class="documents-list">
                    ${s.requirements.map(r => `<li><i class="fa-solid fa-file"></i> ${r}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-users"></i> Кто может подать</h4>
                <p>${s.eligible}</p>
            </div>
            
            <button class="btn-primary btn-full" onclick="applyToScholarship(${s.id})">
                <i class="fa-solid fa-paper-plane"></i> Подать заявку
            </button>
        </div>
    `;
    
    document.getElementById('scholarshipModal').classList.add('show');
}

// ===== Internships =====
function renderInternships() {
    const container = document.getElementById('internshipsGrid');
    if (!container) return;
    container.innerHTML = internships.map(createInternshipCard).join('');
}

function createInternshipCard(intern) {
    return `
        <div class="program-card" onclick="showInternshipDetail(${intern.id})">
            <div class="program-image" style="background: linear-gradient(135deg, #f093fb, #f5576c)">
                <i class="fa-solid fa-briefcase"></i>
                ${intern.paid ? '<span class="program-badge scholarship">Оплачиваемая</span>' : '<span class="program-badge">Стажировка</span>'}
            </div>
            <div class="program-content">
                <p class="program-university">${intern.company}</p>
                <h3 class="program-title">${intern.title}</h3>
                <div class="program-meta">
                    <span><i class="fa-solid fa-location-dot"></i> ${intern.location === 'remote' ? 'Удалённо' : 'На месте'}</span>
                    <span><i class="fa-solid fa-clock"></i> ${intern.duration}</span>
                </div>
                <div class="program-footer">
                    <span class="scholarship-amount">${intern.salary}</span>
                    <div class="program-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); toggleFavorite(${intern.id + 100})" title="В избранное">
                            <i class="fa-solid fa-heart-o"></i>
                        </button>
                        <button class="btn-primary btn-sm" onclick="event.stopPropagation(); applyToInternship(${intern.id})">Подать</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showInternshipDetail(id) {
    const intern = internships.find(i => i.id === id);
    if (!intern) return;
    
    // Если есть статистика - добавить её
    let internStatsSection = '';
    if (intern.stats) {
        internStatsSection = `
            <div class="orhun-detail-stats" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
                <div class="orhun-stat-box">
                    <span class="stat-num">${intern.stats.applications}</span>
                    <span class="stat-label">Заявок подано</span>
                </div>
                <div class="orhun-stat-box">
                    <span class="stat-num">${intern.stats.seats}</span>
                    <span class="stat-label">Мест</span>
                </div>
                <div class="orhun-stat-box">
                    <span class="stat-num">${intern.stats.deadline}</span>
                    <span class="stat-label">Дедлайн</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-chart-bar"></i> Рейтинг претендентов (GPA)</h4>
                <div class="rating-chart">
                    ${intern.rating.map(r => `
                        <div class="rating-bar">
                            <div class="rating-label">${r.range}</div>
                            <div class="rating-progress">
                                <div class="rating-fill ${r.percent >= 35 ? 'high' : r.percent >= 20 ? 'medium' : 'low'}" style="width: ${r.percent}%"></div>
                            </div>
                            <div class="rating-count">${r.count} чел.</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="detail-section">
                <h4><i class="fa-solid fa-user-clock"></i> Недавно подавшие заявки</h4>
                <div class="orhun-applicants-grid">
                    ${intern.recentApplicants.map(app => `
                        <div class="orhun-applicant-mini">
                            <span class="app-avatar" style="background: linear-gradient(135deg, #f093fb, #f5576c);">${app.name[0]}</span>
                            <span class="app-name">${app.name}</span>
                            <span class="app-gpa">GPA ${app.gpa}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    showModal(`${intern.title}`, `
        <div class="scholarship-detail">
            <div class="detail-header">
                <span class="program-badge ${intern.paid ? 'scholarship' : ''}">${intern.paid ? 'Оплачиваемая' : 'Без оплаты'}</span>
                <span class="detail-amount">${intern.salary}</span>
            </div>
            
            ${internStatsSection}
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-info-circle"></i> Описание</h4>
                <p>${intern.description}</p>
            </div>
            
            <div class="detail-grid">
                <div class="detail-item">
                    <i class="fa-solid fa-building"></i>
                    <div><label>Компания</label><span>${intern.company}</span></div>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <div><label>Локация</label><span>${intern.location === 'remote' ? 'Удалённо' : 'На месте'}</span></div>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-clock"></i>
                    <div><label>Длительность</label><span>${intern.duration}</span></div>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-money-bill"></i>
                    <div><label>Зарплата</label><span>${intern.salary}</span></div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fa-solid fa-clipboard-list"></i> Требования</h4>
                <ul class="criteria-list">
                    ${intern.requirements.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            
            <button class="btn-primary btn-full" onclick="applyToInternship(${intern.id}); closeModal();">
                <i class="fa-solid fa-paper-plane"></i> Подать заявку
            </button>
        </div>
    `);
}

function filterInternships() {
    const search = document.getElementById('internshipSearch')?.value.toLowerCase() || '';
    const location = document.getElementById('filterLocation')?.value || '';
    const paid = document.getElementById('filterPaid')?.value || '';
    
    const filtered = internships.filter(i => {
        const matchSearch = i.title.toLowerCase().includes(search) || i.company.toLowerCase().includes(search);
        const matchLocation = !location || i.location === location;
        const matchPaid = !paid || (paid === 'paid' && i.paid) || (paid === 'unpaid' && !i.paid);
        return matchSearch && matchLocation && matchPaid;
    });
    
    const container = document.getElementById('internshipsGrid');
    if (container) {
        container.innerHTML = filtered.length ? filtered.map(createInternshipCard).join('') : '<p class="no-results">Практики не найдены</p>';
    }
}

// ===== Favorites =====
function toggleFavorite(id) {
    if (!currentUser) {
        showToast('Войдите для сохранения в избранное', 'error');
        showPage('login');
        return;
    }
    
    const index = userData.favorites.indexOf(id);
    if (index > -1) {
        userData.favorites.splice(index, 1);
        showToast('Удалено из избранного', 'info');
    } else {
        userData.favorites.push(id);
        showToast('Добавлено в избранное!', 'success');
    }
    
    Storage.set('userData', userData);
    renderPrograms();
    renderInternships();
    renderFavorites();
}

function toggleScholarshipFavorite(id) {
    if (!currentUser) {
        showToast('Войдите для сохранения', 'error');
        return;
    }
    
    const favId = id + 1000;
    const index = userData.favorites.indexOf(favId);
    if (index > -1) {
        userData.favorites.splice(index, 1);
        showToast('Удалено из избранного', 'info');
    } else {
        userData.favorites.push(favId);
        showToast('Добавлено в избранное!', 'success');
    }
    Storage.set('userData', userData);
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    const favoritePrograms = programs.filter(p => userData.favorites.includes(p.id));
    const favoriteInternships = internships.filter(i => userData.favorites.includes(i.id + 100));
    const favoriteScholarships = scholarships.filter(s => userData.favorites.includes(s.id + 1000));
    
    if (favoritePrograms.length === 0 && favoriteInternships.length === 0 && favoriteScholarships.length === 0) {
        container.innerHTML = '<p class="no-results">Пока нет избранных программ</p>';
        return;
    }
    
    container.innerHTML = [
        ...favoritePrograms.map(p => `
            <div class="favorite-item">
                <div class="favorite-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                <div class="favorite-info">
                    <h4>${p.title}</h4>
                    <p>${p.university} • ${p.duration}</p>
                </div>
                <button class="btn-icon" onclick="toggleFavorite(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `),
        ...favoriteScholarships.map(s => `
            <div class="favorite-item">
                <div class="favorite-icon"><i class="fa-solid fa-trophy"></i></div>
                <div class="favorite-info">
                    <h4>${s.name}</h4>
                    <p>${s.provider} • ${s.amount}</p>
                </div>
                <button class="btn-icon" onclick="toggleScholarshipFavorite(${s.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `),
        ...favoriteInternships.map(i => `
            <div class="favorite-item">
                <div class="favorite-icon"><i class="fa-solid fa-briefcase"></i></div>
                <div class="favorite-info">
                    <h4>${i.title}</h4>
                    <p>${i.company} • ${i.duration}</p>
                </div>
                <button class="btn-icon" onclick="toggleFavorite(${i.id + 100})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `)
    ].join('');
}

// ===== Applications =====
function applyToProgram(id) {
    if (!currentUser) {
        showToast('Войдите для подачи заявки', 'error');
        showPage('login');
        return;
    }
    
    const program = programs.find(p => p.id === id);
    userData.applications.push({
        id: Date.now(),
        type: 'program',
        title: program.title,
        university: program.university,
        status: 'pending',
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    Storage.set('userData', userData);
    renderApplications();
    showToast('Заявка отправлена!', 'success');
}

function applyToInternship(id) {
    if (!currentUser) {
        showToast('Войдите для подачи заявки', 'error');
        showPage('login');
        return;
    }
    
    const internship = internships.find(i => i.id === id);
    userData.applications.push({
        id: Date.now(),
        type: 'internship',
        title: internship.title,
        university: internship.company,
        status: 'pending',
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    Storage.set('userData', userData);
    renderApplications();
    showToast('Заявка отправлена!', 'success');
}

function applyToScholarship(id) {
    if (!currentUser) {
        showToast('Войдите для подачи заявки', 'error');
        closeScholarshipModal();
        showPage('login');
        return;
    }
    
    const s = scholarships.find(sch => sch.id === id);
    userData.applications.push({
        id: Date.now(),
        type: 'scholarship',
        title: s.name,
        university: s.provider,
        status: 'pending',
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    Storage.set('userData', userData);
    renderApplications();
    closeScholarshipModal();
    showToast('Заявка на стипендию отправлена!', 'success');
    showPage('applications');
}

function renderApplications() {
    const container = document.getElementById('applicationsList');
    if (!container) return;
    
    if (userData.applications.length === 0) {
        container.innerHTML = '<p class="no-results">Пока нет заявок</p>';
        return;
    }
    
    const typeIcons = {
        program: 'fa-graduation-cap',
        scholarship: 'fa-trophy',
        internship: 'fa-briefcase'
    };
    
    const statusLabels = {
        pending: 'На рассмотрении',
        accepted: 'Принята',
        rejected: 'Отклонена'
    };
    
    container.innerHTML = userData.applications.map(app => `
        <div class="application-item">
            <div class="application-icon">
                <i class="fa-solid ${typeIcons[app.type]}"></i>
            </div>
            <div class="application-info">
                <h4>${app.title}</h4>
                <p>${app.university} • Подана ${app.date}</p>
            </div>
            <span class="application-status ${app.status}">${statusLabels[app.status]}</span>
        </div>
    `).join('');
}

// ===== Profile =====
function updateProfile() {
    if (!currentUser) return;
    
    const initials = currentUser.name[0] + (currentUser.surname ? currentUser.surname[0] : '');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileUniversity = document.getElementById('profileUniversity');
    
    if (profileAvatar) profileAvatar.textContent = initials;
    if (profileName) profileName.textContent = `${currentUser.name} ${currentUser.surname || ''}`;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileUniversity) profileUniversity.innerHTML = `<i class="fa-solid fa-building-columns"></i> ${currentUser.university}`;
}

function showProfileTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

function renderAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    
    if (userData.achievements.length === 0) {
        container.innerHTML = '<p class="no-results">Нет достижений. Добавьте свои награды и достижения!</p>';
        return;
    }

    container.innerHTML = userData.achievements.map((achievement, index) => `
        <div class="achievement-card">
            <div class="achievement-icon">
                <i class="fa-solid ${achievement.icon}"></i>
            </div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
            <button class="btn-icon" onclick="deleteAchievement(${index})" title="Удалить">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function renderLanguages() {
    const container = document.getElementById('languagesList');
    if (!container) return;

    if (userData.languages.length === 0) {
        container.innerHTML = '<p class="no-results">Нет языков. Добавьте языки, которыми владеете!</p>';
        return;
    }

    const flags = { 
        'Английский': '🇬🇧', 
        'Немецкий': '🇩🇪', 
        'Французский': '🇫🇷', 
        'Испанский': '🇪🇸', 
        'Китайский': '🇨🇳', 
        'Русский': '🇷🇺', 
        'Узбекский': '🇺🇿', 
        'Казахский': '🇰🇿',
        'Кыргызский': '🇰🇬',
        'Турецкий': '🇹🇷'
    };

    const levelLabels = {
        'A1': 'Начальный',
        'A2': 'Базовый',
        'B1': 'Средний',
        'B2': 'Выше среднего',
        'C1': 'Продвинутый',
        'C2': 'В совершенстве',
        'native': 'Родной'
    };
    
    container.innerHTML = userData.languages.map(lang => `
        <div class="language-item">
            <div class="language-icon">${flags[lang.name] || '🌐'}</div>
            <div class="language-info">
                <h4>${lang.name}</h4>
                <span class="language-level">${lang.level} - ${levelLabels[lang.level] || ''}</span>
            </div>
            <div class="language-bar">
                <div class="language-bar-fill" style="width: ${lang.percentage}%"></div>
            </div>
            <button class="btn-icon" onclick="deleteLanguage('${lang.name}')" title="Удалить">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function addAchievement() {
    if (!currentUser) {
        showToast('Войдите для добавления', 'error');
        return;
    }

    showModal('Добавить достижение', `
        <form id="addAchievementForm" onsubmit="saveNewAchievement(event)">
            <div class="form-group">
                <label>Название</label>
                <input type="text" id="newAchTitle" placeholder="Победитель хакатона" required>
            </div>
            <div class="form-group">
                <label>Описание</label>
                <textarea id="newAchDesc" rows="3" placeholder="1 место на TechCrunch Hackathon 2023"></textarea>
            </div>
            <div class="form-group">
                <label>Категория</label>
                <select id="newAchIcon">
                    <option value="fa-trophy">🏆 Награда</option>
                    <option value="fa-book">📚 Публикация</option>
                    <option value="fa-star">⭐ Достижение</option>
                    <option value="fa-medal">🏅 Медаль</option>
                    <option value="fa-certificate">📜 Сертификат</option>
                    <option value="fa-lightbulb">💡 Проект</option>
                    <option value="fa-code">💻 Хакатон</option>
                    <option value="fa-users">👥 Волонтёрство</option>
                </select>
            </div>
            <button type="submit" class="btn-primary btn-full">Добавить</button>
        </form>
    `);
}

function saveNewAchievement(e) {
    e.preventDefault();
    
    const title = document.getElementById('newAchTitle').value;
    const description = document.getElementById('newAchDesc').value;
    const icon = document.getElementById('newAchIcon').value;
    
    userData.achievements.push({ title, description, icon });
    Storage.set('userData', userData);
    renderAchievements();
    closeModal();
    showToast('Достижение добавлено!', 'success');
}

function deleteAchievement(index) {
    if (confirm('Удалить это достижение?')) {
        userData.achievements.splice(index, 1);
        Storage.set('userData', userData);
        renderAchievements();
        showToast('Достижение удалено', 'info');
    }
}

function addLanguage() {
    if (!currentUser) {
        showToast('Войдите для добавления', 'error');
        return;
    }

    showModal('Добавить язык', `
        <form id="addLanguageForm" onsubmit="saveNewLanguage(event)">
            <div class="form-group">
                <label>Язык</label>
                <select id="newLangName">
                    <option value="Английский">Английский</option>
                    <option value="Немецкий">Немецкий</option>
                    <option value="Французский">Французский</option>
                    <option value="Испанский">Испанский</option>
                    <option value="Китайский">Китайский</option>
                    <option value="Русский">Русский</option>
                    <option value="Узбекский">Узбекский</option>
                    <option value="Казахский">Казахский</option>
                    <option value="Кыргызский">Кыргызский</option>
                    <option value="Турецкий">Турецкий</option>
                </select>
            </div>
            <div class="form-group">
                <label>Уровень владения</label>
                <select id="newLangLevel">
                    <option value="A1">A1 - Начальный</option>
                    <option value="A2">A2 - Базовый</option>
                    <option value="B1" selected>B1 - Средний</option>
                    <option value="B2">B2 - Выше среднего</option>
                    <option value="C1">C1 - Продвинутый</option>
                    <option value="C2">C2 - Владение в совершенстве</option>
                    <option value="native">Родной</option>
                </select>
            </div>
            <button type="submit" class="btn-primary btn-full">Добавить</button>
        </form>
    `);
}

function saveNewLanguage(e) {
    e.preventDefault();
    
    const name = document.getElementById('newLangName').value;
    const level = document.getElementById('newLangLevel').value;
    const levels = { A1: 20, A2: 40, B1: 60, B2: 75, C1: 90, C2: 100, native: 100 };
    
    // Проверить, не добавлен ли уже этот язык
    if (userData.languages.some(l => l.name === name)) {
        showToast('Этот язык уже добавлен', 'error');
        return;
    }
    
    userData.languages.push({ 
        name, 
        level, 
        percentage: levels[level] || 50 
    });
    
    Storage.set('userData', userData);
    renderLanguages();
    closeModal();
    showToast('Язык добавлен!', 'success');
}

function deleteLanguage(name) {
    if (confirm(`Удалить ${name} из списка языков?`)) {
        userData.languages = userData.languages.filter(l => l.name !== name);
        Storage.set('userData', userData);
        renderLanguages();
        showToast('Язык удалён', 'info');
    }
}

function editProfile() {
    if (!currentUser) {
        showToast('Войдите для редактирования профиля', 'error');
        showPage('login');
        return;
    }

    showModal('Редактирование профиля', `
        <form id="editProfileForm" onsubmit="saveProfile(event)">
            <div class="form-section">
                <h4><i class="fa-solid fa-user"></i> Личные данные</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Имя</label>
                        <input type="text" id="editName" value="${currentUser.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Фамилия</label>
                        <input type="text" id="editSurname" value="${currentUser.surname || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="editEmail" value="${currentUser.email || ''}" required>
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" id="editPhone" placeholder="+996 700 123 456" value="${userData.phone || ''}">
                </div>
            </div>

            <div class="form-section">
                <h4><i class="fa-solid fa-graduation-cap"></i> Академические данные</h4>
                <div class="form-group">
                    <label>Университет</label>
                    <select id="editUniversity">
                        <option value="МГУ им. Ломоносова" ${(userData.university || currentUser.university) === 'МГУ им. Ломоносова' ? 'selected' : ''}>МГУ им. Ломоносова</option>
                        <option value="СПбГУ" ${(userData.university || currentUser.university) === 'СПбГУ' ? 'selected' : ''}>СПбГУ</option>
                        <option value="Национальный университет Узбекистана" ${(userData.university || currentUser.university) === 'Национальный университет Узбекистана' ? 'selected' : ''}>Национальный университет Узбекистана</option>
                        <option value="Казахский национальный университет" ${(userData.university || currentUser.university) === 'Казахский национальный университет' ? 'selected' : ''}>Казахский национальный университет</option>
                        <option value="Кыргызский национальный университет" ${(userData.university || currentUser.university) === 'Кыргызский национальный университет' ? 'selected' : ''}>Кыргызский национальный университет</option>
                        <option value="Таджикский национальный университет" ${(userData.university || currentUser.university) === 'Таджикский национальный университет' ? 'selected' : ''}>Таджикский национальный университет</option>
                        <option value="Другие" ${!['МГУ им. Ломоносова','СПбГУ','Национальный университет Узбекистана','Казахский национальный университет','Кыргызский национальный университет','Таджикский национальный университет'].includes(userData.university || currentUser.university) ? 'selected' : ''}>Другие</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Факультет</label>
                        <input type="text" id="editFaculty" value="${userData.faculty || ''}" placeholder="Компьютерные науки">
                    </div>
                    <div class="form-group">
                        <label>Курс</label>
                        <select id="editCourse">
                            ${[1,2,3,4,5,6].map(c => `<option value="${c}" ${userData.course === c ? 'selected' : ''}>${c} курс</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Средний балл (GPA)</label>
                    <input type="number" id="editGPA" value="${userData.gpa || ''}" min="0" max="5" step="0.1" placeholder="4.5">
                </div>
                <div class="form-group">
                    <label>Специальность</label>
                    <select id="editField">
                        <option value="">Выберите специальность</option>
                        <option value="computer-science" ${userData.field === 'computer-science' ? 'selected' : ''}>Computer Science</option>
                        <option value="engineering" ${userData.field === 'engineering' ? 'selected' : ''}>Инженерия</option>
                        <option value="business" ${userData.field === 'business' ? 'selected' : ''}>Бизнес</option>
                        <option value="medicine" ${userData.field === 'medicine' ? 'selected' : ''}>Медицина</option>
                        <option value="economics" ${userData.field === 'economics' ? 'selected' : ''}>Экономика</option>
                        <option value="law" ${userData.field === 'law' ? 'selected' : ''}>Право</option>
                        <option value="humanities" ${userData.field === 'humanities' ? 'selected' : ''}>Гуманитарные науки</option>
                    </select>
                </div>
            </div>

            <button type="submit" class="btn-primary btn-full">
                <i class="fa-solid fa-save"></i> Сохранить изменения
            </button>
        </form>
    `);
}

function saveProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('editName').value;
    const surname = document.getElementById('editSurname').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const university = document.getElementById('editUniversity').value;
    const faculty = document.getElementById('editFaculty').value;
    const course = parseInt(document.getElementById('editCourse').value);
    const gpa = parseFloat(document.getElementById('editGPA').value);
    const field = document.getElementById('editField').value;

    // Обновить данные пользователя
    currentUser.name = name;
    currentUser.surname = surname;
    currentUser.email = email;
    currentUser.university = university;

    // Обновить расширенные данные
    userData.phone = phone;
    userData.faculty = faculty;
    userData.course = course;
    userData.gpa = gpa;
    userData.field = field;

    // Сохранить в localStorage
    Storage.set('currentUser', currentUser);
    Storage.set('userData', userData);

    // Обновить отображение
    updateProfile();
    updateNav();
    renderAchievements();
    renderLanguages();

    // Обновить данные об академии на странице
    document.getElementById('gpaValue').textContent = gpa || '-';
    document.getElementById('courseValue').textContent = course || '-';
    document.getElementById('facultyValue').textContent = faculty || '-';

    closeModal();
    showToast('Профиль обновлён!', 'success');
}

function editAcademic() {
    if (!currentUser) {
        showToast('Войдите для редактирования', 'error');
        return;
    }

    showModal('Редактирование академических данных', `
        <form id="editAcademicForm" onsubmit="saveAcademic(event)">
            <div class="form-group">
                <label>Средний балл (GPA)</label>
                <input type="number" id="editGPA2" value="${userData.gpa || ''}" min="0" max="5" step="0.1" placeholder="4.5">
                <small style="color: var(--gray)">Шкала от 0 до 5</small>
            </div>
            <div class="form-group">
                <label>Курс</label>
                <select id="editCourse2">
                    ${[1,2,3,4,5,6].map(c => `<option value="${c}" ${userData.course === c ? 'selected' : ''}>${c} курс</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Факультет</label>
                <input type="text" id="editFaculty2" value="${userData.faculty || ''}" placeholder="Компьютерные науки">
            </div>
            <div class="form-group">
                <label>Специальность</label>
                <select id="editField2">
                    <option value="">Выберите</option>
                    <option value="computer-science" ${userData.field === 'computer-science' ? 'selected' : ''}>Computer Science</option>
                    <option value="engineering" ${userData.field === 'engineering' ? 'selected' : ''}>Инженерия</option>
                    <option value="business" ${userData.field === 'business' ? 'selected' : ''}>Бизнес</option>
                    <option value="medicine" ${userData.field === 'medicine' ? 'selected' : ''}>Медицина</option>
                    <option value="economics" ${userData.field === 'economics' ? 'selected' : ''}>Экономика</option>
                    <option value="law" ${userData.field === 'law' ? 'selected' : ''}>Право</option>
                    <option value="humanities" ${userData.field === 'humanities' ? 'selected' : ''}>Гуманитарные науки</option>
                </select>
            </div>
            <button type="submit" class="btn-primary btn-full">Сохранить</button>
        </form>
    `);
}

function saveAcademic(e) {
    e.preventDefault();
    
    userData.gpa = parseFloat(document.getElementById('editGPA2').value) || null;
    userData.course = parseInt(document.getElementById('editCourse2').value);
    userData.faculty = document.getElementById('editFaculty2').value;
    userData.field = document.getElementById('editField2').value;

    Storage.set('userData', userData);

    // Обновить отображение
    document.getElementById('gpaValue').textContent = userData.gpa || '-';
    document.getElementById('courseValue').textContent = userData.course || '-';
    document.getElementById('facultyValue').textContent = userData.faculty || '-';

    closeModal();
    showToast('Академические данные обновлены!', 'success');
}

function uploadTranscript(e) {
    const file = e.target.files[0];
    if (file) {
        showToast(`Файл "${file.name}" загружен!`, 'success');
    }
}

// ===== University Dashboard =====
function showCreateProgramModal() {
    showModal('Добавить программу', `
        <form onsubmit="createProgram(event)">
            <div class="form-group">
                <label>Название программы</label>
                <input type="text" id="progTitle" required>
            </div>
            <div class="form-group">
                <label>Тип</label>
                <select id="progType">
                    <option value="exchange">Программа обмена</option>
                    <option value="master">Магистратура</option>
                    <option value="summer">Летняя школа</option>
                    <option value="internship">Практика</option>
                </select>
            </div>
            <div class="form-group">
                <label>Длительность</label>
                <input type="text" id="progDuration" placeholder="1 семестр" required>
            </div>
            <div class="form-group">
                <label>Стипендия</label>
                <select id="progScholarship">
                    <option value="full">Полная</option>
                    <option value="partial">Частичная</option>
                    <option value="none">Нет</option>
                </select>
            </div>
            <div class="form-group">
                <label>Сумма</label>
                <input type="text" id="progAmount" placeholder="$10,000">
            </div>
            <div class="form-group">
                <label>Дедлайн</label>
                <input type="date" id="progDeadline" required>
            </div>
            <button type="submit" class="btn-primary btn-full">Создать программу</button>
        </form>
    `);
}

function createProgram(e) {
    e.preventDefault();
    showToast('Программа создана!', 'success');
    closeModal();
}

// ===== Deadlines =====
function renderDeadlines(filter = 'all') {
    const container = document.getElementById('deadlinesTimeline');
    if (!container) return;

    // Объединить программы и стипендии
    const allDeadlines = [
        ...programs.map(p => ({
            id: p.id,
            type: 'program',
            title: p.title,
            university: p.university,
            deadline: p.deadline,
            amount: p.amount
        })),
        ...scholarships.map(s => ({
            id: s.id,
            type: 'scholarship',
            title: s.name,
            university: s.provider,
            deadline: s.deadline,
            amount: s.amount
        }))
    ];

    // Фильтрация
    let filtered = filter === 'all' 
        ? allDeadlines 
        : allDeadlines.filter(d => d.type === filter);

    // Сортировка по дате
    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Берём только ближайшие 10
    const upcoming = filtered.slice(0, 10);

    container.innerHTML = upcoming.map(item => {
        const date = new Date(item.deadline);
        const today = new Date();
        const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
        
        let statusClass = 'normal';
        let statusText = 'Времени достаточно';
        
        if (diffDays <= 3) {
            statusClass = 'urgent';
            statusText = 'Срочно!';
        } else if (diffDays <= 14) {
            statusClass = 'soon';
            statusText = 'Скоро';
        }

        const day = date.getDate();
        const month = date.toLocaleDateString('ru-RU', { month: 'short' });

        return `
            <div class="deadline-item ${statusClass}">
                <div class="deadline-date">
                    <div class="deadline-day">${day}</div>
                    <div class="deadline-month">${month}</div>
                </div>
                <div class="deadline-info">
                    <div class="deadline-type">
                        <i class="fa-solid ${item.type === 'program' ? 'fa-graduation-cap' : 'fa-trophy'}"></i>
                        ${item.type === 'program' ? 'Программа обмена' : 'Стипендия'}
                    </div>
                    <div class="deadline-title">${item.title}</div>
                    <div class="deadline-meta">
                        <span><i class="fa-solid fa-building"></i> ${item.university}</span>
                        <span><i class="fa-solid fa-money-bill"></i> ${item.amount}</span>
                    </div>
                </div>
                <div class="deadline-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
        `;
    }).join('');
}

function filterDeadlines(filter) {
    // Обновить активную кнопку
    document.querySelectorAll('.deadline-filter').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderDeadlines(filter);
}

// ===== ORHUN Program =====
function renderOrhunApplicants() {
    const container = document.getElementById('orhunApplicants');
    if (!container) return;

    // Демо данные зарегистрировавшихся
    const applicants = [
        { name: 'Айнура', gpa: 4.9 },
        { name: 'Бектур', gpa: 4.8 },
        { name: 'Чынгыз', gpa: 4.7 },
        { name: 'Элиза', gpa: 4.9 },
        { name: 'Нурлан', gpa: 4.6 },
        { name: 'Асель', gpa: 4.8 },
        { name: 'Дастан', gpa: 4.5 },
        { name: 'Мира', gpa: 4.7 },
    ];

    container.innerHTML = applicants.map(app => `
        <div class="applicant-card">
            <div class="applicant-avatar">${app.name[0]}</div>
            <div class="applicant-name">${app.name}</div>
            <div class="applicant-gpa">GPA: ${app.gpa}</div>
        </div>
    `).join('');
}

function applyToOrhun() {
    if (!currentUser) {
        showToast('Войдите для подачи заявки', 'error');
        showPage('login');
        return;
    }
    
    // Подать заявку на программу ОРХУН
    userData.applications.push({
        id: Date.now(),
        type: 'program',
        title: 'Программа ОРХУН - Бакалавриат',
        university: 'Кыргызско-Турецкий университет "Манас"',
        status: 'pending',
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    Storage.set('userData', userData);
    renderApplications();
    showToast('Заявка на программу ОРХУН отправлена!', 'success');
    showPage('applications');
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        userData,
        renderFeaturedPrograms,
        renderPrograms,
        filterPrograms,
        renderUniversities,
        renderScholarships,
        filterScholarships,
        showScholarshipDetail,
        renderInternships,
        filterInternships,
        toggleFavorite,
        renderFavorites,
        renderApplications,
        applyToProgram,
        applyToInternship,
        applyToScholarship,
        updateProfile,
        showProfileTab,
        renderAchievements,
        renderLanguages,
        addAchievement,
        addLanguage,
        showCreateProgramModal
    };
}
