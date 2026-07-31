// ===== ГЛОБАЛЬНЫЕ ДАННЫЕ =====
let products = [];
let services = [];
let currentCategory = 'boards';

// ===== ЗАГРУЗКА ДАННЫХ =====
function loadData() {
    const storedProducts = localStorage.getItem('snowshop_products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [
            { id: 1, name: 'Burton Custom', price: '49 900 ₽', image: 'https://images.unsplash.com/photo-1551698613-55f2bf2cb3f1?w=400&h=400&fit=crop', category: 'boards', desc: 'Классический фрирайд' },
            { id: 2, name: 'Union Force', price: '24 500 ₽', image: 'https://images.unsplash.com/photo-1634067473700-8f2e5c6aa2b8?w=400&h=400&fit=crop', category: 'bindings', desc: 'Надёжные крепления' },
            { id: 3, name: 'Nitro Team', price: '32 200 ₽', image: 'https://images.unsplash.com/photo-1600442717570-325f2c6af79c?w=400&h=400&fit=crop', category: 'boots', desc: 'Жёсткие ботинки' },
            { id: 4, name: 'Smith Vantage', price: '18 700 ₽', image: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop', category: 'helmets', desc: 'Лёгкий шлем' },
            { id: 5, name: 'Jones Flagship', price: '58 300 ₽', image: 'https://images.unsplash.com/photo-1551698613-55f2bf2cb3f1?w=400&h=400&fit=crop', category: 'boards', desc: 'Фрирайд для глубокого снега' },
            { id: 6, name: 'Burton Step On', price: '28 900 ₽', image: 'https://images.unsplash.com/photo-1634067473700-8f2e5c6aa2b8?w=400&h=400&fit=crop', category: 'bindings', desc: 'Быстрый вход' },
        ];
        saveProducts();
    }
    
    const storedServices = localStorage.getItem('snowshop_services');
    if (storedServices) {
        services = JSON.parse(storedServices);
    } else {
        services = [
            { id: 1, name: 'Заточка кантов', price: '1 500 ₽', desc: 'Профессиональная заточка кантов' },
            { id: 2, name: 'Смазка скользяка', price: '2 200 ₽', desc: 'Горячая смазка с чисткой' },
            { id: 3, name: 'Ремонт скользящей поверхности', price: '3 500 ₽', desc: 'Устранение царапин и сколов' },
            { id: 4, name: 'Установка креплений', price: '1 000 ₽', desc: 'Профессиональная установка' },
        ];
        saveServices();
    }
    
    renderCatalog(currentCategory);
    renderServices();
}

function saveProducts() {
    localStorage.setItem('snowshop_products', JSON.stringify(products));
}

function saveServices() {
    localStorage.setItem('snowshop_services', JSON.stringify(services));
}

// ===== РЕНДЕРИНГ =====
function renderCatalog(category) {
    const catalog = document.getElementById('catalog');
    const filtered = products.filter(p => p.category === category);
    
    if (filtered.length === 0) {
        catalog.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px 0; color:var(--text-secondary);">❄️ Товаров пока нет</div>`;
        return;
    }

    catalog.innerHTML = filtered.map((p, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.05}s;">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%2314181c%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23555%22 font-size=%2240%22 font-family=%22Arial%22%3E🏂%3C/text%3E%3C/svg%3E'">
            <div class="name">${p.name}</div>
            <div class="price">${p.price}</div>
            <div class="desc">${p.desc || ''}</div>
        </div>
    `).join('');
}

function renderServices() {
    const container = document.getElementById('services');
    
    if (services.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px 0; color:var(--text-secondary);">🔧 Услуг пока нет</div>`;
        return;
    }

    container.innerHTML = services.map((s, index) => `
        <div class="service-card" style="animation-delay: ${index * 0.05}s;">
            <div class="service-header">
                <div class="service-name">${s.name}</div>
                <div class="service-price">${s.price}</div>
            </div>
            <div class="service-desc">${s.desc || 'Без описания'}</div>
        </div>
    `).join('');
}

// ===== НАВИГАЦИЯ =====
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            const category = this.dataset.category;
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (tab === 'catalog') {
                document.getElementById('catalog').style.display = 'grid';
                document.getElementById('services').style.display = 'none';
                currentCategory = category;
                renderCatalog(currentCategory);
            } else if (tab === 'services') {
                document.getElementById('catalog').style.display = 'none';
                document.getElementById('services').style.display = 'flex';
                renderServices();
            }
        });
    });
}

// ===== ЗАГРУЗОЧНЫЙ ЭКРАН =====
function initSplash() {
    const splash = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');
    const skipBtn = document.getElementById('skip-splash');
    
    const today = new Date();
    const decFirst = new Date(today.getFullYear(), 11, 1);
    if (today >= decFirst) {
        splash.style.display = 'none';
        mainApp.style.display = 'flex';
        return;
    }

    function updateCountdown() {
        const now = new Date();
        const winter = new Date(now.getFullYear(), 11, 1);
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
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    function closeSplash() {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            mainApp.style.display = 'flex';
        }, 400);
    }
    
    setTimeout(closeSplash, 5000);
    skipBtn.addEventListener('click', closeSplash);
}

// ===== АДМИНКА =====
function addProduct() {
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const category = document.getElementById('product-category').value;
    const desc = document.getElementById('product-desc').value.trim();
    
    if (!name || !price || !image) {
        alert('Заполните все поля');
        return;
    }
    
    products.push({ id: Date.now(), name, price, image, category, desc: desc || 'Без описания' });
    saveProducts();
    renderAdminProductList();
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-desc').value = '';
    alert('✅ Товар добавлен!');
}

function renderAdminProductList() {
    const container = document.getElementById('product-list-admin');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);">Товаров нет</p>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="product-item">
            <div>
                <strong>${p.name}</strong> — ${p.price}
                <div style="font-size:12px; color:var(--text-secondary);">${p.category}</div>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${p.id})">✕</button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderAdminProductList();
    renderCatalog(currentCategory);
}

function addService() {
    const name = document.getElementById('service-name').value.trim();
    const price = document.getElementById('service-price').value.trim();
    const desc = document.getElementById('service-desc').value.trim();
    
    if (!name || !price) {
        alert('Заполните название и цену');
        return;
    }
    
    services.push({ id: Date.now(), name, price, desc: desc || 'Без описания' });
    saveServices();
    renderAdminServiceList();
    document.getElementById('service-name').value = '';
    document.getElementById('service-price').value = '';
    document.getElementById('service-desc').value = '';
    alert('✅ Услуга добавлена!');
}

function renderAdminServiceList() {
    const container = document.getElementById('service-list-admin');
    if (!container) return;
    
    if (services.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);">Услуг нет</p>';
        return;
    }
    
    container.innerHTML = services.map(s => `
        <div class="service-item">
            <div class="service-info">
                <strong>${s.name}</strong>
                <span class="service-meta">${s.price}</span>
                <div style="font-size:13px; color:var(--text-secondary);">${s.desc || ''}</div>
            </div>
            <div class="service-actions">
                <button class="edit-btn" onclick="editService(${s.id})">✎</button>
                <button class="delete-btn" onclick="deleteService(${s.id})">✕</button>
            </div>
        </div>
    `).join('');
}

function deleteService(id) {
    if (!confirm('Удалить услугу?')) return;
    services = services.filter(s => s.id !== id);
    saveServices();
    renderAdminServiceList();
    renderServices();
}

function editService(id) {
    const service = services.find(s => s.id === id);
    if (!service) return;
    
    const newName = prompt('Название:', service.name);
    if (newName !== null) service.name = newName.trim() || service.name;
    const newPrice = prompt('Цена:', service.price);
    if (newPrice !== null) service.price = newPrice.trim() || service.price;
    const newDesc = prompt('Описание:', service.desc);
    if (newDesc !== null) service.desc = newDesc.trim() || service.desc;
    
    saveServices();
    renderAdminServiceList();
    renderServices();
}

function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const panel = this.dataset.tab;
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${panel}-panel`).classList.add('active');
        });
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupNavigation();
    initSplash();
    
    if (document.getElementById('product-list-admin')) {
        renderAdminProductList();
        renderAdminServiceList();
        setupAdminTabs();
    }
});
