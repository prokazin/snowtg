// === УНИКАЛЬНЫЙ КЛЮЧ ДЛЯ LOCALSTORAGE ===
const STORAGE_KEY = 'snowboard_shop_products_v1';

// === УПРАВЛЕНИЕ ТОВАРАМИ ===
let products = [];
let currentCategory = 'boards';

// === ЗАГРУЗКА ДАННЫХ ===
function loadProducts() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            products = JSON.parse(stored);
            if (!Array.isArray(products)) products = [];
        } else {
            seedDemoProducts();
        }
    } catch (e) {
        products = [];
        seedDemoProducts();
    }
}

function saveProducts() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
        console.warn('Не удалось сохранить данные');
    }
}

// === ДЕМО-ТОВАРЫ ===
function seedDemoProducts() {
    products = [
        { name: 'Burton Custom', price: '59 990 ₽', image: '🏂', category: 'boards', desc: 'Классический кембер для фрирайда', specs: 'Длина: 156см, Жесткость: 7/10' },
        { name: 'Union Force', price: '24 990 ₽', image: '⛓️', category: 'bindings', desc: 'Надежные крепления для парка', specs: 'Вес: 1.2кг, Материал: алюминий' },
        { name: 'Vans Hi-Standard', price: '18 490 ₽', image: '🥾', category: 'boots', desc: 'Комфортные ботинки с шнуровкой', specs: 'Размер: 43, Жесткость: 5/10' },
        { name: 'Oakley Mod 1', price: '14 990 ₽', image: '⛑️', category: 'helmets', desc: 'Легкий шлем с вентиляцией', specs: 'Вес: 400г, Сертификат: CE' },
        { name: 'Smith Squad', price: '12 490 ₽', image: '🥽', category: 'goggles', desc: 'Панорамные очки с защитой UV', specs: 'Линза: хром, Совместимость: да' }
    ];
    saveProducts();
}

// === ТАЙМЕР ДО ЗИМЫ ===
function updateCountdown() {
    const now = new Date();
    let winter = new Date(now.getFullYear(), 11, 1);
    if (now > winter) winter.setFullYear(winter.getFullYear() + 1);
    
    const diff = winter - now;
    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// === ОТРИСОВКА ТОВАРОВ ===
function renderProducts(category) {
    const area = document.getElementById('content-area');
    const filtered = products.filter(p => p && p.category === category);
    
    if (!filtered.length) {
        area.innerHTML = `<div style="grid-column:1/-1; text-align:center; opacity:0.5; padding:40px 0; font-size:clamp(14px, 4vw, 16px);">Нет товаров в этой категории</div>`;
        return;
    }

    area.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-image">${p.image || '🏂'}</div>
            <div class="product-name">${escapeHtml(p.name || 'Без названия')}</div>
            <div class="product-price">${escapeHtml(p.price || '0 ₽')}</div>
            <div class="product-desc">${escapeHtml(p.desc || '')}</div>
            <div class="product-specs">${escapeHtml(p.specs || '')}</div>
        </div>
    `).join('');
}

// === БЕЗОПАСНОСТЬ (защита от XSS) ===
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === НАВИГАЦИЯ ===
function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderProducts(currentCategory);
        });
    });
}

// === ЗАГРУЗОЧНЫЙ ЭКРАН ===
function initSplash() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');
    const closeBtn = document.getElementById('close-splash');

    const now = new Date();
    const dec1 = new Date(now.getFullYear(), 11, 1);
    
    if (now >= dec1) {
        splash.style.display = 'none';
        app.style.display = 'flex';
        return;
    }

    let splashHidden = false;
    
    function hideSplash() {
        if (splashHidden) return;
        splashHidden = true;
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            app.style.display = 'flex';
        }, 800);
    }

    // Автоматическое скрытие через 5 секунд
    setTimeout(hideSplash, 5000);

    // Ручное закрытие
    closeBtn.addEventListener('click', hideSplash);
    
    // Закрытие по свайпу вверх (для мобильных)
    let touchStartY = 0;
    splash.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    splash.addEventListener('touchmove', (e) => {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY < -50) hideSplash();
    });
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initSplash();
    renderProducts(currentCategory);
    setupNavigation();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
