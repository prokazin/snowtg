// === ДАННЫЕ ===
let products = JSON.parse(localStorage.getItem('snowboard_products')) || [
    {
        id: 1,
        name: 'Burton Custom 2025',
        price: '54 990 ₽',
        image: 'https://placehold.co/600x400/1a3a4a/white?text=Burton+Custom',
        desc: 'Легендарная модель для фрирайда и парка. Идеально подходит для катания по целине и в парке. Универсальная геометрия позволяет уверенно чувствовать себя на любом склоне. Сердечник из дерева с карбоновыми вставками обеспечивает отличную упругость и контроль.',
        specs: ['Длина: 156 см', 'Жесткость: 7/10', 'Camber'],
        category: 'Доски'
    },
    {
        id: 2,
        name: 'Union Force',
        price: '24 500 ₽',
        image: 'https://placehold.co/600x400/2a4a5a/white?text=Union+Force',
        desc: 'Надежные крепления для любого стиля катания. Алюминиевая база с высоким качеством обработки. Быстрая регулировка под любой размер ботинка. Отличная передача усилий на кант.',
        specs: ['Вес: 1.2 кг', 'Материал: Алюминий'],
        category: 'Крепления'
    },
    {
        id: 3,
        name: 'Adidas Tactical ADV',
        price: '19 990 ₽',
        image: 'https://placehold.co/600x400/3a5a6a/white?text=Adidas+ADV',
        desc: 'Ботинки с системой быстрой шнуровки и анатомической стелькой. Превосходная поддержка голеностопа и комфорт в течение всего дня катания. Внешняя оболочка из прочного материала защищает от влаги.',
        specs: ['Размер: 42-46', 'Жесткость: 6/10'],
        category: 'Ботинки'
    },
    {
        id: 4,
        name: 'Oakley MOD1',
        price: '14 200 ₽',
        image: 'https://placehold.co/600x400/4a6a7a/white?text=Oakley+MOD1',
        desc: 'Легкий шлем с вентиляционной системой и защитой от ударов. Интегрированная система регулировки размера. Внутренняя подкладка из гипоаллергенных материалов отводит влагу.',
        specs: ['Вес: 380 г', 'Сертификат: CE'],
        category: 'Шлемы'
    }
];

// === КАТЕГОРИИ С ИКОНКАМИ ===
let categories = JSON.parse(localStorage.getItem('snowboard_categories')) || [
    { name: 'Доски', icon: 'Доски.png' },
    { name: 'Ботинки', icon: 'Ботинки.png' },
    { name: 'Шлемы', icon: 'Шлем.png' },
    { name: 'Маски', icon: 'Маски.png' }
];

let currentTab = categories.length > 0 ? categories[0].name : '';

// === РЕНДЕР КАТАЛОГА ===
function renderCatalog(category) {
    const container = document.getElementById('catalog');
    const filtered = products.filter(p => p.category === category);

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#8e8e93; font-size:clamp(14px,2.5vw,16px);">Нет товаров в этой категории</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <h3>${p.name}</h3>
            <div class="price">${p.price}</div>
            <div class="desc-preview">${p.desc}</div>
            <div class="specs">${p.specs.slice(0, 3).map(s => `<span>${s}</span>`).join('')}</div>
            <div class="read-more">Читать полностью →</div>
        </div>
    `).join('');
}

// === РЕНДЕР НАВИГАЦИИ ===
function renderNav() {
    const nav = document.getElementById('bottom-nav');
    if (!categories || categories.length === 0) {
        nav.innerHTML = '<span style="color:#8e8e93; padding:8px; font-size:14px;">Нет категорий</span>';
        return;
    }

    nav.innerHTML = categories.map(cat => `
        <button class="nav-btn ${currentTab === cat.name ? 'active' : ''}" data-tab="${cat.name}">
            <img src="${cat.icon}" alt="${cat.name}" />
        </button>
    `).join('');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.dataset.tab;
            renderCatalog(currentTab);
        });
    });
}

// === МОДАЛЬНОЕ ОКНО ===
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <div class="modal-price">${product.price}</div>
        <div class="modal-desc">${product.desc}</div>
        <div class="modal-specs">${product.specs.map(s => `<span>${s}</span>`).join('')}</div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

// === ЗАКРЫТИЕ МОДАЛКИ ПО КЛИКУ ВНЕ ===
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
});

// === ЗАГРУЗОЧНЫЙ ЭКРАН ===
function updateCountdown() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 1);
    if (now > target) target.setFullYear(target.getFullYear() + 1);
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    const msg = document.getElementById('splash-message');
    if (msg) {
        if (days < 30) msg.textContent = '❄️ Сезон уже близко!';
        else if (days < 60) msg.textContent = '⛷️ Готовь снаряжение!';
        else msg.textContent = '🏔️ До первого снега осталось...';
    }
}

function shouldHideSplash() {
    const now = new Date();
    return now.getMonth() === 11 && now.getDate() === 1;
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');
    const closeBtn = document.getElementById('close-splash');

    // Проверяем, нужно ли скрыть сплеш (1 декабря)
    if (shouldHideSplash()) {
        if (splash) splash.style.display = 'none';
        if (app) {
            app.style.display = 'flex';
            setTimeout(() => {
                app.classList.add('visible');
            }, 50);
            renderNav();
            if (currentTab) renderCatalog(currentTab);
        }
        return;
    }

    // Запускаем таймер обратного отсчета
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Автоматическое закрытие через 5 секунд
    let splashTimer = setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                if (app) {
                    app.style.display = 'flex';
                    setTimeout(() => {
                        app.classList.add('visible');
                    }, 50);
                    renderNav();
                    if (currentTab) renderCatalog(currentTab);
                }
            }, 400);
        }
        clearInterval(countdownInterval);
    }, 5000);

    // Закрытие по кнопке
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            clearTimeout(splashTimer);
            clearInterval(countdownInterval);
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
                    if (app) {
                        app.style.display = 'flex';
                        setTimeout(() => {
                            app.classList.add('visible');
                        }, 50);
                        renderNav();
                        if (currentTab) renderCatalog(currentTab);
                    }
                }, 400);
            }
        });
    }

    // Обработка ошибок загрузки иконок
    document.querySelectorAll('.nav-btn img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://placehold.co/32/cccccc/aaaaaa?text=?';
        });
    });
});

// === ОБНОВЛЕНИЕ ДАННЫХ ИЗ LOCALSTORAGE ===
// Функция для обновления каталога после изменений в админке
window.refreshCatalog = function() {
    products = JSON.parse(localStorage.getItem('snowboard_products')) || products;
    categories = JSON.parse(localStorage.getItem('snowboard_categories')) || categories;
    renderNav();
    if (currentTab) renderCatalog(currentTab);
};

// === ЗАЩИТА ОТ СЛУЧАЙНОГО ЗУМА НА iOS ===
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// === ПРЕДОТВРАЩЕНИЕ ДВОЙНОГО КЛИКА ДЛЯ ЗУМА ===
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });
