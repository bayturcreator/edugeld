/**
 * Main.js - Главный файл приложения
 * Инициализация и управление навигацией
 */

// ===== Page Navigation =====
function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
        
        // Обновить URL
        history.pushState(null, '', `#${pageId}`);
        
        // Обновить nav для мобильных
        document.getElementById('navLinks')?.classList.remove('show');
    }
}

// ===== Animated Background =====
function initAnimatedBackground() {
    const canvas = document.getElementById('animatedBg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 120;
    const mouseDistance = 150;
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseDistance) {
                    const force = (mouseDistance - dist) / mouseDistance;
                    p.x -= dx * force * 0.02;
                    p.y -= dy * force * 0.02;
                }
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 150, 255, ${0.15 * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(drawParticles);
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();
}

// ===== Initialize App =====
function initApp() {
    // Инициализация навигации
    updateNav();
    
    // Рендер данных
    renderFeaturedPrograms();
    renderPrograms();
    renderUniversities();
    renderScholarships();
    renderInternships();
    renderFavorites();
    renderApplications();
    renderAchievements();
    renderLanguages();
    renderDeadlines();
    renderOrhunApplicants();
    populateUniversityFilters();
    
    // Обновить профиль если пользователь вошёл
    if (currentUser) {
        updateProfile();
    }
    
    // Обработка URL hash
    handleHashNavigation();
    
    // Инициализация анимированного фона
    initAnimatedBackground();
    
    console.log('✅ StudentConnect инициализирован');
}

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showPage, initApp, initAnimatedBackground };
}
