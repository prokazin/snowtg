const ADMIN_PASSWORD = 'admin123';
let currentTab = 'products';
const API_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

// === ЗАГРУЗКА ТОВАРОВ ИЗ API ===
async function loadProductsFromAPI() {
    try {
        const response = await fetch(API_URL + 'api/products');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        return data;
    } catch (e) {
        console.error('Ошибка загрузки из API:', e);
        return [];
    }
}

// === СОХРАНЕНИЕ ТОВАРОВ В API ===
async function saveProductsToAPI(products) {
    try {
        const response = await fetch(API_URL + 'api/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(products)
        });
        
        if (!response.ok) throw new Error('Ошибка сохранения');
        const result = await response.json();
        return result.success === true;
    } catch (e) {
        console.error('❌ Ошибка сохранения в API:', e);
        alert('❌ Ошибка сохранения: ' + e.message);
        return false;
    }
}

// === ЗАГРУЗКА ОПОВЕЩЕНИЯ ===
async function loadCurrentAnnouncement() {
    try {
        const response = await fetch(API_URL + 'api/announcement');
        const data = await response.json();
        const container = document.getElementById('current-announcement');
        const textEl = document.getElementById('current-announcement-text');
        
        if (container && textEl && data.text) {
            container.style.display = 'block';
            textEl.textContent = data.text;
        } else if (container) {
            container.style.display = 'none';
        }
    } catch (e) {
        console.error('Ошибка загрузки оповещения:', e);
    }
}

// === ОТПРАВКА ОПОВЕЩЕНИЯ ===
async function sendAnnouncement() {
    const input = document.getElementById('announcement-input');
    if (!input) return;
    const text = input.value.trim();
    
    if (!text) {
        alert('Введите текст оповещения');
        return;
    }
    
    try {
        const response = await fetch(API_URL + 'api/announcement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        
        const result = await response.json();
        if (result.success) {
            await loadCurrentAnnouncement();
            input.value = '';
            alert('✅ Оповещение отправлено!');
        } else {
            alert('❌ Ошибка отправки оповещения');
        }
    } catch (e) {
        console.error('❌ Ошибка:', e);
        alert('❌ Ошибка отправки оповещения');
    }
}

async function clearAnnouncement() {
    if (!confirm('Удалить оповещение?')) return;
    
    try {
        const response = await fetch(API_URL + 'api/announcement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: '' })
        });
        
        const result = await response.json();
        if (result.success) {
            const container = document.getElementById('current-announcement');
            if (container) container.style.display = 'none';
            alert('✅ Оповещение удалено!');
        } else {
            alert('❌ Ошибка удаления оповещения');
        }
    } catch (e) {
        console.error('❌ Ошибка:', e);
        alert('❌ Ошибка удаления оповещения');
    }
}

// === ВКЛАДКИ ===
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'products') {
        document.querySelector('.tabs button:nth-child(1)').classList.add('active');
        document.getElementById('tab-products').classList.add('active');
        renderProductList();
    } else if (tab === 'services') {
        document.querySelector('.tabs button:nth-child(2)').classList.add('active');
        document.getElementById('tab-services').classList.add('active');
        renderServiceList();
    } else if (tab === 'announcements') {
        document.querySelector('.tabs button:nth-child(3)').classList.add('active');
        document.getElementById('tab-announcements').classList.add('active');
        loadCurrentAnnouncement();
    }
}

// === ПОЛУЧЕНИЕ КАТЕГОРИЙ ===
function getCategories() {
    try {
        const data = localStorage.getItem('snowboard_categories');
        if (!data) {
            const defaultCategories = [
                { name: 'Доски', icon: 'Доски.png' },
                { name: 'Ботинки', icon: 'Ботинки.png' },
                { name: 'Шлемы', icon: 'Шлем.png' },
                { name: 'Маски', icon: 'Маски.png' },
                { name: 'Чехлы', icon: 'Чехлы.png' },
                { name: 'Крепления', icon: 'Крепления.png' },
                { name: 'Сервис', icon: 'Сервис.png' },
                { name: 'Контакты', icon: 'Контакт.png' }
            ];
            localStorage.setItem('snowboard_categories', JSON.stringify(defaultCategories));
            return defaultCategories;
        }
        return JSON.parse(data);
    } catch (e) {
        console.error('Ошибка загрузки категорий:', e);
        return [];
    }
}

// === ХАРАКТЕРИСТИКИ ===
function addSpecRow(nameValue, valueValue) {
    const container = document.getElementById('specs-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `
        <input type="text" class="spec-name" placeholder="Название (например: Длина)" value="${nameValue || ''}" />
        <input type="text" class="spec-value" placeholder="Значение (например: 156 см)" value="${valueValue || ''}" />
        <button class="remove-spec" onclick="removeSpec(this)">✕</button>
    `;
    container.appendChild(row);
}

function removeSpec(button) {
    const container = document.getElementById('specs-container');
    if (!container) return;
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Должна быть хотя бы одна характеристика');
    }
}

function getSpecs() {
    const rows = document.querySelectorAll('#specs-container .spec-row');
    const specs = [];
    rows.forEach(row => {
        const name = row.querySelector('.spec-name').value.trim();
        const value = row.querySelector('.spec-value').value.trim();
        if (name && value) {
            specs.push({ name, value });
        }
    });
    return specs;
}

function addServiceSpecRow(nameValue, valueValue) {
    const container = document.getElementById('service-specs-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `
        <input type="text" class="spec-name" placeholder="Название (например: Время)" value="${nameValue || ''}" />
        <input type="text" class="spec-value" placeholder="Значение (например: 30 мин)" value="${valueValue || ''}" />
        <button class="remove-spec" onclick="removeServiceSpec(this)">✕</button>
    `;
    container.appendChild(row);
}

function removeServiceSpec(button) {
    const container = document.getElementById('service-specs-container');
    if (!container) return;
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Должна быть хотя бы одна характеристика');
    }
}

function getServiceSpecs() {
    const rows = document.querySelectorAll('#service-specs-container .spec-row');
    const specs = [];
    rows.forEach(row => {
        const name = row.querySelector('.spec-name').value.trim();
        const value = row.querySelector('.spec-value').value.trim();
        if (name && value) {
            specs.push({ name, value });
        }
    });
    return specs;
}

// === ТОВАРЫ ===
async function getProducts() {
    return await loadProductsFromAPI();
}

async function saveProducts(products) {
    const success = await saveProductsToAPI(products);
    if (success) {
        localStorage.setItem('snowboard_products_cache', JSON.stringify(products));
        await renderProductList();
        await renderServiceList();
        if (window.opener && !window.opener.closed) {
            window.opener.products = products;
            if (window.opener.currentTab) {
                window.opener.renderCatalog(window.opener.currentTab);
            }
        }
        return true;
    }
    return false;
}

async function renderProductList() {
    const list = document.getElementById('product-list');
    if (!list) return;
    
    const products = await getProducts();
    const filtered = products.filter(p => p.category !== 'Сервис' && !p.isContact);
    
    if (!filtered || filtered.length === 0) {
        list.innerHTML = '<p style="color:#8e8e93; padding:10px 0; text-align:center;">Нет товаров</p>';
        return;
    }
    
    list.innerHTML = filtered.map((p, i) => {
        const originalIndex = products.indexOf(p);
        return `
            <div class="item">
                <div class="info">
                    <strong>${p.name}</strong><br />
                    <span style="color:#007aff;">${p.price}</span>
                    <span style="color:#8e8e93; font-size:13px; margin-left:8px;">${p.category}</span>
                    <br /><small style="color:#8e8e93;">${p.specs ? p.specs.length : 0} характеристик</small>
                </div>
                <div class="actions">
                    <button class="edit-btn" onclick="editProduct(${originalIndex})">✏️</button>
                    <button class="delete-btn" onclick="deleteProduct(${originalIndex})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

async function addProduct() {
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const imageUrl = document.getElementById('product-image-url').value.trim();
    const desc = document.getElementById('product-desc').value.trim();
    const category = document.getElementById('product-category').value;
    const specs = getSpecs();

    if (!name || !price || !desc) {
        alert('Заполните название, цену и описание');
        return;
    }

    if (specs.length === 0) {
        alert('Добавьте хотя бы одну характеристику');
        return;
    }

    const image = imageUrl || 'https://placehold.co/600x400/ffffff/cccccc?text=No+Image';
    
    const products = await getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = { 
        id: newId, 
        name, 
        price, 
        images: [image],
        desc, 
        specs, 
        category,
        isContact: false
    };
    
    products.push(newProduct);
    
    const saved = await saveProducts(products);
    if (saved) {
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-image-url').value = '';
        document.getElementById('product-desc').value = '';
        document.getElementById('product-image-file').value = '';
        
        const container = document.getElementById('specs-container');
        if (container) {
            container.innerHTML = '';
            addSpecRow('', '');
        }
        
        await renderProductList();
        alert('✅ Товар "' + name + '" добавлен!');
    }
}

function uploadProductImage() {
    const fileInput = document.getElementById('product-image-file');
    if (!fileInput) return;
    const file = fileInput.files[0];
    if (!file) {
        alert('Выберите файл с изображением');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимум 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('product-image-url').value = e.target.result;
        alert('✅ Изображение загружено!');
    };
    reader.onerror = function() {
        alert('Ошибка загрузки файла');
    };
    reader.readAsDataURL(file);
}

async function deleteProduct(index) {
    if (!confirm('Удалить товар?')) return;
    const products = await getProducts();
    products.splice(index, 1);
    await saveProducts(products);
    await renderProductList();
    alert('✅ Товар удален!');
}

async function editProduct(index) {
    const products = await getProducts();
    const p = products[index];
    
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-image-url').value = p.images ? p.images[0] : '';
    document.getElementById('product-desc').value = p.desc;
    document.getElementById('product-category').value = p.category;
    
    const container = document.getElementById('specs-container');
    if (container) {
        container.innerHTML = '';
        if (p.specs && p.specs.length > 0) {
            p.specs.forEach(spec => {
                addSpecRow(spec.name, spec.value);
            });
        } else {
            addSpecRow('', '');
        }
    }
    
    products.splice(index, 1);
    await saveProducts(products);
    await renderProductList();
    
    document.getElementById('product-name').scrollIntoView({ behavior: 'smooth' });
    alert('✏️ Редактирование: ' + p.name);
}

// === УСЛУГИ ===
async function getServices() {
    const products = await getProducts();
    return products.filter(p => p.category === 'Сервис');
}

async function renderServiceList() {
    const list = document.getElementById('service-list');
    if (!list) return;
    
    const products = await getProducts();
    const services = products.filter(p => p.category === 'Сервис');
    
    if (!services || services.length === 0) {
        list.innerHTML = '<p style="color:#8e8e93; padding:10px 0; text-align:center;">Нет услуг</p>';
        return;
    }
    
    list.innerHTML = services.map((p, i) => {
        const originalIndex = products.indexOf(p);
        return `
            <div class="item">
                <div class="info">
                    <strong>${p.name}</strong><br />
                    <span style="color:#007aff;">${p.price}</span>
                    <span style="color:#8e8e93; font-size:13px; margin-left:8px;">${p.category}</span>
                    <br /><small style="color:#8e8e93;">${p.specs ? p.specs.length : 0} характеристик</small>
                </div>
                <div class="actions">
                    <button class="edit-btn" onclick="editService(${originalIndex})">✏️</button>
                    <button class="delete-btn" onclick="deleteService(${originalIndex})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

async function addService() {
    const name = document.getElementById('service-name').value.trim();
    const price = document.getElementById('service-price').value.trim();
    const imageUrl = document.getElementById('service-image-url').value.trim();
    const desc = document.getElementById('service-desc').value.trim();
    const specs = getServiceSpecs();

    if (!name || !price || !desc) {
        alert('Заполните название, цену и описание');
        return;
    }

    if (specs.length === 0) {
        alert('Добавьте хотя бы одну характеристику');
        return;
    }

    const image = imageUrl || 'https://placehold.co/600x400/ffffff/cccccc?text=No+Image';
    
    const products = await getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    products.push({ 
        id: newId, 
        name, 
        price, 
        images: [image],
        desc, 
        specs, 
        category: 'Сервис',
        isContact: false
    });
    
    const saved = await saveProducts(products);
    if (saved) {
        document.getElementById('service-name').value = '';
        document.getElementById('service-price').value = '';
        document.getElementById('service-image-url').value = '';
        document.getElementById('service-desc').value = '';
        document.getElementById('service-image-file').value = '';
        
        const container = document.getElementById('service-specs-container');
        if (container) {
            container.innerHTML = '';
            addServiceSpecRow('', '');
        }
        
        await renderServiceList();
        alert('✅ Услуга "' + name + '" добавлена!');
    }
}

function uploadServiceImage() {
    const fileInput = document.getElementById('service-image-file');
    if (!fileInput) return;
    const file = fileInput.files[0];
    if (!file) {
        alert('Выберите файл с изображением');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимум 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('service-image-url').value = e.target.result;
        alert('✅ Изображение загружено!');
    };
    reader.onerror = function() {
        alert('Ошибка загрузки файла');
    };
    reader.readAsDataURL(file);
}

async function deleteService(index) {
    if (!confirm('Удалить услугу?')) return;
    const products = await getProducts();
    products.splice(index, 1);
    await saveProducts(products);
    await renderServiceList();
    alert('✅ Услуга удалена!');
}

async function editService(index) {
    const products = await getProducts();
    const p = products[index];
    
    document.getElementById('service-name').value = p.name;
    document.getElementById('service-price').value = p.price;
    document.getElementById('service-image-url').value = p.images ? p.images[0] : '';
    document.getElementById('service-desc').value = p.desc;
    
    const container = document.getElementById('service-specs-container');
    if (container) {
        container.innerHTML = '';
        if (p.specs && p.specs.length > 0) {
            p.specs.forEach(spec => {
                addServiceSpecRow(spec.name, spec.value);
            });
        } else {
            addServiceSpecRow('', '');
        }
    }
    
    products.splice(index, 1);
    await saveProducts(products);
    await renderServiceList();
    
    document.getElementById('service-name').scrollIntoView({ behavior: 'smooth' });
    alert('✏️ Редактирование: ' + p.name);
}

// === ВХОД ===
function loginAdmin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        
        renderProductList();
        renderServiceList();
        loadCurrentAnnouncement();
        
        const container = document.getElementById('specs-container');
        if (container) {
            container.innerHTML = '';
            addSpecRow('', '');
        }
        
        const serviceContainer = document.getElementById('service-specs-container');
        if (serviceContainer) {
            serviceContainer.innerHTML = '';
            addServiceSpecRow('', '');
        }
        
    } else {
        alert('❌ Неверный пароль');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async function() {
    await renderProductList();
    await renderServiceList();
    await loadCurrentAnnouncement();
});

// === ОБНОВЛЕНИЕ ПРИ ИЗМЕНЕНИИ В LOCALSTORAGE ===
window.addEventListener('storage', async function(e) {
    if (e.key === 'snowboard_products') {
        await renderProductList();
        await renderServiceList();
    }
});

// Экспортируем функции для глобального использования
window.getProducts = getProducts;
window.saveProducts = saveProducts;
window.addSpecRow = addSpecRow;
window.removeSpec = removeSpec;
window.addServiceSpecRow = addServiceSpecRow;
window.removeServiceSpec = removeServiceSpec;
window.switchTab = switchTab;
window.sendAnnouncement = sendAnnouncement;
window.clearAnnouncement = clearAnnouncement;
window.loadCurrentAnnouncement = loadCurrentAnnouncement;
window.uploadProductImage = uploadProductImage;
window.uploadServiceImage = uploadServiceImage;
window.addProduct = addProduct;
window.addService = addService;
window.deleteProduct = deleteProduct;
window.deleteService = deleteService;
window.editProduct = editProduct;
window.editService = editService;
window.loginAdmin = loginAdmin;
