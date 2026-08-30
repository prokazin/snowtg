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

let currentTab = categories[0]?.name || 'Доски';
let currentImageIndex = 0;
let products = [];

const APP_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

// === ЗАГРУЗКА ТОВАРОВ ИЗ API ===
async function loadProductsFromAPI() {
    try {
        const response = await fetch(APP_URL + 'api/products');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        products = data;
        localStorage.setItem('snowboard_products_cache', JSON.stringify(products));
        return products;
    } catch (e) {
        console.error('Ошибка загрузки из API:', e);
        const cached = localStorage.getItem('snowboard_products_cache');
        if (cached) {
            products = JSON.parse(cached);
            return products;
        }
        return [];
    }
}

// === ЗАГРУЗКА ОПОВЕЩЕНИЯ ИЗ API ===
async function loadAnnouncementFromAPI() {
    try {
        const response = await fetch(APP_URL + 'api/announcement');
        const data = await response.json();
        
        const banner = document.getElementById('announcement-banner');
        const text = document.getElementById('announcement-text');
        
        if (banner && text && data.text && data.text !== '') {
            text.textContent = data.text;
            banner.style.display = 'block';
            return data.text;
        } else if (banner) {
            banner.style.display = 'none';
            return null;
        }
    } catch (e) {
        console.error('Ошибка загрузки оповещения:', e);
        return null;
    }
}

function closeAnnouncement() {
    const banner = document.getElementById('announcement-banner');
    if (banner) banner.style.display = 'none';
}

// === ФОРМАТИРОВАНИЕ ЦЕНЫ ===
function formatPrice(price) {
    if (!price) return '';
    // Убираем лишние пробелы и символы
    let clean = price.replace(/[^\d]/g, '');
    if (!clean) return price;
    // Добавляем пробел между тысячами
    let formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formatted + ' ₽';
}

// === РЕНДЕР КАТАЛОГА ===
function renderCatalog(category) {
    const container = document.getElementById('catalog');
    if (!container) {
        console.error('Элемент #catalog не найден');
        return;
    }
    
    if (category === 'Контакты') {
        renderContacts(container);
        return;
    }
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-message">Загрузка товаров...</div>';
        return;
    }
    
    const filtered = products.filter(p => p.category === category && !p.isContact);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-message">Нет товаров в этой категории</div>';
        return;
    }
    
    container.innerHTML = filtered.map(p => {
        const imageUrl = p.images && p.images.length > 0 && p.images[0] ? p.images[0] : 'https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото';
        const formattedPrice = formatPrice(p.price);
        return `
            <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
                <div class="product-image-wrapper">
                    <img src="${imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'" />
                </div>
                <h3>${p.name}</h3>
                <div class="price">${formattedPrice}</div>
                <div class="desc-preview">${p.desc}</div>
                <div class="specs">
                    ${p.specs && p.specs.length > 0 ? p.specs.slice(0, 2).map(s => `<span>${s.name}: ${s.value}</span>`).join('') : ''}
                </div>
                <div class="read-more">Читать полностью →</div>
            </div>
        `;
    }).join('');
}

function renderContacts(container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-message">Контакты не найдены</div>';
        return;
    }
    
    const contact = products.find(p => p.isContact);
    if (!contact) {
        container.innerHTML = '<div class="empty-message">Контакты не найдены</div>';
        return;
    }
    
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
    if (!nav) {
        console.error('Элемент #bottom-nav не найден');
        return;
    }
    
    if (!categories || categories.length === 0) {
        nav.innerHTML = '<span style="color:#8e8e93; padding:8px; font-size:14px;">Нет категорий</span>';
        return;
    }

    nav.innerHTML = categories.map(cat => `
        <button class="nav-btn ${currentTab === cat.name ? 'active' : ''}" data-tab="${cat.name}">
            <img src="${cat.icon}" alt="${cat.name}" onerror="this.src='https://placehold.co/32/cccccc/aaaaaa?text=?'" />
        </button>
    `).join('');

    nav.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.getAttribute('data-tab');
            if (tab) {
                currentTab = tab;
                renderCatalog(currentTab);
            }
        });
    });
}

// === МОДАЛЬНОЕ ОКНО С ПРИБЛИЖЕНИЕМ ===
function openModal(productId) {
    if (!products || products.length === 0) {
        console.error('Товары не загружены');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Товар с id', productId, 'не найден');
        return;
    }

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) {
        console.error('Модальное окно не найдено');
        return;
    }
    
    currentImageIndex = 0;
    
    const hasMultipleImages = product.images && product.images.length > 1;
    const images = product.images || ['https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'];

    body.innerHTML = `
        <div class="modal-image-container">
            <img id="modal-main-image" src="${images[0]}" alt="${product.name}" onerror="this.src='https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'" onclick="openZoom(this.src)" />
            ${hasMultipleImages ? `
                <button class="carousel-btn carousel-left" onclick="changeImage(${product.id}, -1)">‹</button>
                <button class="carousel-btn carousel-right" onclick="changeImage(${product.id}, 1)">›</button>
                <div class="carousel-dots">
                    ${images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToImage(${product.id}, ${idx})"></span>`).join('')}
                </div>
            ` : ''}
            <div class="zoom-hint">🔍 Нажми на фото для увеличения</div>
        </div>
        <h2>${product.name}</h2>
        <div class="modal-price">${formatPrice(product.price)}</div>
        <div class="modal-desc">${product.desc}</div>
        <div class="modal-specs">
            ${product.specs && product.specs.length > 0 ? product.specs.map(s => `<div class="spec-item"><span class="spec-name">${s.name}</span><span class="spec-value">${s.value}</span></div>`).join('') : ''}
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
        mainImg.onclick = function() { openZoom(this.src); };
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
        mainImg.onclick = function() { openZoom(this.src); };
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

// === ПРИБЛИЖЕНИЕ ФОТО ===
function openZoom(imageSrc) {
    if (!imageSrc || imageSrc.includes('placehold.co')) return;
    
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    
    if (!zoomModal || !zoomImage) return;
    
    zoomImage.src = imageSrc;
    zoomModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeZoom() {
    const zoomModal = document.getElementById('image-zoom-modal');
    if (zoomModal) zoomModal.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async function() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');

    // Загружаем товары из API
    await loadProductsFromAPI();
    
    // Загружаем оповещение
    await loadAnnouncementFromAPI();

    // Автоматическое закрытие через 3 секунды
    let splashTimer = setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                const video = document.getElementById('splash-video');
                if (video) video.pause();
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
    }, 3000);

    // Обработчики для модалки товара
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    // Обработчики для модалки увеличения
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomClose = document.getElementById('zoom-close');
    if (zoomClose) {
        zoomClose.addEventListener('click', closeZoom);
    }
    if (zoomModal) {
        zoomModal.addEventListener('click', function(e) {
            if (e.target === this) closeZoom();
        });
    }
});

window.refreshCatalog = function() {
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
