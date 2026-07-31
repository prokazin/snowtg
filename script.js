// === КАТЕГОРИИ ===
const categories = [
    { name: 'Доски', icon: 'Доски.png' },
    { name: 'Ботинки', icon: 'Ботинки.png' },
    { name: 'Шлемы', icon: 'Шлем.png' },
    { name: 'Маски', icon: 'Маски.png' },
    { name: 'Чехлы', icon: 'Чехлы.png' },
    { name: 'Крепления', icon: 'Крепления.png' },
    { name: 'Сервис', icon: 'Сервис.png' },
    { name: 'Контакты', icon: 'Контакт.png' }
];

localStorage.setItem('snowboard_categories', JSON.stringify(categories));

let currentTab = categories[0].name;
let currentImageIndex = 0;

const BOT_TOKEN = '8803506830:AAFtJO4nJt4l5Cfzl_LHlQhAXIVsMorrN18';
const APP_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

// === КОНТАКТЫ ===
const contactsData = {
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Сноубордная, д. 15',
    workHours: 'Пн-Вс: 9:00 - 19:00',
    email: 'info@snowboard-store.ru'
};

// === ОПОВЕЩЕНИЯ ===
function loadAnnouncement() {
    try {
        const announcement = localStorage.getItem('announcement');
        if (!announcement) return null;
        
        const data = JSON.parse(announcement);
        const now = new Date().getTime();
        
        if (!data.expires || now < data.expires) {
            const banner = document.getElementById('announcement-banner');
            const text = document.getElementById('announcement-text');
            if (banner && text && data.text) {
                text.textContent = data.text;
                banner.style.display = 'block';
                return data.text;
            }
        } else {
            // Если истекло - удаляем
            localStorage.removeItem('announcement');
            const banner = document.getElementById('announcement-banner');
            if (banner) banner.style.display = 'none';
        }
    } catch (e) {
        console.error('Ошибка загрузки оповещения:', e);
        localStorage.removeItem('announcement');
    }
    return null;
}

function saveAnnouncement(text, hours = 24) {
    if (!text || text.trim() === '') {
        localStorage.removeItem('announcement');
        const banner = document.getElementById('announcement-banner');
        if (banner) banner.style.display = 'none';
        return;
    }
    
    const expires = new Date().getTime() + (hours * 60 * 60 * 1000);
    localStorage.setItem('announcement', JSON.stringify({ text: text.trim(), expires }));
    
    const banner = document.getElementById('announcement-banner');
    const textEl = document.getElementById('announcement-text');
    if (banner && textEl) {
        textEl.textContent = text.trim();
        banner.style.display = 'block';
    }
}

// === ТОВАРЫ ===
const defaultProducts = [
    // ... (все товары из предыдущих версий)
    {
        id: 43,
        name: '📞 Контакты',
        price: '',
        images: [],
        desc: 'Свяжитесь с нами любым удобным способом!',
        specs: [
            { name: 'Телефон', value: contactsData.phone },
            { name: 'Адрес', value: contactsData.address },
            { name: 'Режим работы', value: contactsData.workHours },
            { name: 'Email', value: contactsData.email }
        ],
        category: 'Контакты',
        isContact: true
    }
];

function loadProducts() {
    let storedProducts = JSON.parse(localStorage.getItem('snowboard_products'));
    const allProducts = [...defaultProducts];
    
    if (!storedProducts || storedProducts.length < allProducts.length) {
        localStorage.setItem('snowboard_products', JSON.stringify(allProducts));
        return allProducts;
    }
    
    const storedIds = storedProducts.map(p => p.id);
    const missingProducts = allProducts.filter(p => !storedIds.includes(p.id));
    
    if (missingProducts.length > 0) {
        storedProducts = [...storedProducts, ...missingProducts];
        localStorage.setItem('snowboard_products', JSON.stringify(storedProducts));
    }
    
    return storedProducts;
}

let products = loadProducts();

function renderCatalog(category) {
    const container = document.getElementById('catalog');
    if (!container) return;
    
    if (category === 'Контакты') {
        renderContacts(container);
        return;
    }
    
    const filtered = products.filter(p => p.category === category && !p.isContact);
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-message">Нет товаров в этой категории</div>`;
        return;
    }
    
    container.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
            <img src="${p.images && p.images.length > 0 ? p.images[0] : 'https://placehold.co/600x400/ffffff/cccccc?text=No+Image'}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/ffffff/cccccc?text=No+Image'" />
            <h3>${p.name}</h3>
            <div class="price">${p.price}</div>
            <div class="desc-preview">${p.desc}</div>
            <div class="specs">
                ${p.specs.slice(0, 2).map(s => `<span>${s.name}: ${s.value}</span>`).join('')}
            </div>
            <div class="read-more">Читать полностью →</div>
        </div>
    `).join('');
}

function renderContacts(container) {
    const contact = products.find(p => p.isContact);
    if (!contact) {
        container.innerHTML = '<div class="empty-message">Контакты не найдены</div>';
        return;
    }
    
    // Иконки для контактов (по одной на каждый)
    const icons = ['📱', '📍', '🕐', '📧'];
    
    container.innerHTML = `
        <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 18px; padding: 24px; border: 1px solid rgba(255,255,255,0.15);">
            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">📞 Контакты</h2>
            ${contact.specs.map((s, index) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: ${index < contact.specs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'};">
                    <span style="font-size: 22px; min-width: 36px;">${icons[index] || '📌'}</span>
                    <div style="flex: 1;">
                        <div style="color: rgba(255,255,255,0.7); font-size: 13px;">${s.name}</div>
                        <div style="color: #ffffff; font-size: 16px; font-weight: 500; text-shadow: 0 1px 4px rgba(0,0,0,0.3);">${s.value}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderNav() {
    const nav = document.getElementById('bottom-nav');
    if (!nav) return;
    if (!categories || categories.length === 0) {
        nav.innerHTML = '<span style="color:#8e8e93; padding:8px; font-size:14px;">Нет категорий</span>';
        return;
    }

    nav.innerHTML = categories.map(cat => `
        <button class="nav-btn ${currentTab === cat.name ? 'active' : ''}" data-tab="${cat.name}">
            <img src="${cat.icon}" alt="${cat.name}" onerror="this.src='https://placehold.co/32/cccccc/aaaaaa?text=?'" />
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

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;
    
    currentImageIndex = 0;
    
    const hasMultipleImages = product.images && product.images.length > 1;
    const images = product.images || ['https://placehold.co/600x400/ffffff/cccccc?text=No+Image'];

    body.innerHTML = `
        <div class="modal-image-container">
            <img id="modal-main-image" src="${images[0]}" alt="${product.name}" onerror="this.src='https://placehold.co/600x400/ffffff/cccccc?text=No+Image'" />
            ${hasMultipleImages ? `
                <button class="carousel-btn carousel-left" onclick="changeImage(${product.id}, -1)">‹</button>
                <button class="carousel-btn carousel-right" onclick="changeImage(${product.id}, 1)">›</button>
                <div class="carousel-dots">
                    ${images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToImage(${product.id}, ${idx})"></span>`).join('')}
                </div>
            ` : ''}
        </div>
        <h2>${product.name}</h2>
        <div class="modal-price">${product.price}</div>
        <div class="modal-desc">${product.desc}</div>
        <div class="modal-specs">
            ${product.specs.map(s => `<div class="spec-item"><span class="spec-name">${s.name}</span><span class="spec-value">${s.value}</span></div>`).join('')}
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.dataset.productId = productId;
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function changeImage(productId, direction) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) return;
    
    const images = product.images;
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    
    const mainImg = document.getElementById('modal-main-image');
    if (mainImg) {
        mainImg.src = images[currentImageIndex];
        mainImg.alt = product.name;
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentImageIndex);
    });
}

function goToImage(productId, index) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || index >= product.images.length) return;
    
    currentImageIndex = index;
    const mainImg = document.getElementById('modal-main-image');
    if (mainImg) {
        mainImg.src = product.images[index];
        mainImg.alt = product.name;
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

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
    
    // Загружаем оповещение при старте
    loadAnnouncement();
});

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

document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');
    const closeBtn = document.getElementById('close-splash');

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

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

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
});

window.refreshCatalog = function() {
    products = JSON.parse(localStorage.getItem('snowboard_products')) || products;
    renderNav();
    if (currentTab) renderCatalog(currentTab);
};

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// === ЭКСПОРТ ДЛЯ АДМИНКИ ===
window.loadAnnouncement = loadAnnouncement;
window.saveAnnouncement = saveAnnouncement;
window.contactsData = contactsData;
