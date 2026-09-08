const ADMIN_PASSWORD = 'admin123';
let currentTab = 'products';
const API_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

// === ПЕРЕМЕННЫЕ ДЛЯ ЗАГРУЗКИ НЕСКОЛЬКИХ ФОТО ===
let uploadedImages = [];

// === КОНФИГУРАЦИЯ ХАРАКТЕРИСТИК ДЛЯ КАЖДОЙ КАТЕГОРИИ ===
const categorySpecs = {
    'Доски': [
        { name: 'Размер', type: 'text', placeholder: 'Несколько размеров через запятую (например: 151, 154, 156)' },
        { name: 'Прогиб', type: 'text', placeholder: 'Например: Camber, Flat, Rocker' },
        { name: 'Уровень', type: 'text', placeholder: 'Например: Начинающий, Средний, Профессиональный' },
        { name: 'Жесткость', type: 'text', placeholder: 'Например: 6/10, Мягкая, Жесткая' },
        { name: 'Назначение', type: 'text', placeholder: 'Например: Фрирайд, Парк, Трасса' }
    ],
    'Ботинки': [
        { name: 'Размер', type: 'text', placeholder: 'Несколько размеров через запятую (например: 40, 41, 42, 43)' },
        { name: 'Жесткость', type: 'text', placeholder: 'Например: 6/10, Мягкая, Жесткая' },
        { name: 'Назначение', type: 'text', placeholder: 'Например: Фрирайд, Парк, Трасса' },
        { name: 'Уровень', type: 'text', placeholder: 'Например: Начинающий, Средний, Профессиональный' },
        { name: 'Шнуровка', type: 'text', placeholder: 'Например: Быстрая, Классическая, BOA' }
    ],
    'Крепления': [
        { name: 'Размер', type: 'text', placeholder: 'Несколько размеров через запятую (например: S, M, L, XL)' },
        { name: 'Жесткость', type: 'text', placeholder: 'Например: 6/10, Мягкая, Жесткая' },
        { name: 'Назначение', type: 'text', placeholder: 'Например: Фрирайд, Парк, Трасса' },
        { name: 'Уровень', type: 'text', placeholder: 'Например: Начинающий, Средний, Профессиональный' },
        { name: 'Вид', type: 'text', placeholder: 'Например: Классические, Скользящие' }
    ]
};

// === ДЕФОЛТНЫЕ ХАРАКТЕРИСТИКИ ДЛЯ ДРУГИХ КАТЕГОРИЙ ===
const defaultSpecs = [
    { name: 'Характеристика 1', type: 'text', placeholder: 'Значение' },
    { name: 'Характеристика 2', type: 'text', placeholder: 'Значение' }
];

// === СЖАТИЕ ИЗОБРАЖЕНИЙ ===
function compressImage(dataUrl, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = height * (maxWidth / width);
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = width * (maxHeight / height);
                height = maxHeight;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
}

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
        console.log('📤 Отправка данных на сервер...');
        console.log('📦 Количество товаров:', products.length);
        
        const jsonStr = JSON.stringify(products);
        const sizeInMB = jsonStr.length / (1024 * 1024);
        console.log('📊 Размер данных:', sizeInMB.toFixed(2), 'MB');
        
        if (sizeInMB > 8) {
            alert('❌ Слишком много данных! Уменьшите количество фото или их размер.');
            return false;
        }
        
        const response = await fetch(API_URL + 'api/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: jsonStr
        });
        
        console.log('📥 Статус ответа:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Ошибка сервера:', errorText);
            throw new Error('Ошибка сервера: ' + response.status);
        }
        
        const result = await response.json();
        console.log('📥 Ответ сервера:', result);
        
        if (result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Неизвестная ошибка');
        }
    } catch (e) {
        console.error('❌ Ошибка сохранения в API:', e);
        alert('❌ Ошибка сохранения: ' + e.message + '\nПопробуйте загрузить меньше фото или сжать изображения.');
        return false;
    }
}

// === ФОРМАТИРОВАНИЕ ЦЕНЫ ===
function formatPrice(price) {
    if (!price) return '';
    let clean = price.replace(/[^\d]/g, '');
    if (!clean) return price;
    let formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formatted + ' ₽';
}

// === ОБНОВЛЕНИЕ СТАТИСТИКИ ===
async function updateStats() {
    const products = await getProducts();
    const allProducts = products || [];
    const services = allProducts.filter(p => p.category === 'Сервис');
    const goods = allProducts.filter(p => p.category !== 'Сервис' && !p.isContact);
    
    document.getElementById('stats-products').textContent = goods.length;
    document.getElementById('stats-services').textContent = services.length;
    
    const categories = new Set(goods.map(p => p.category));
    document.getElementById('stats-categories').textContent = categories.size;
    
    let totalImages = 0;
    goods.forEach(p => {
        if (p.images) totalImages += p.images.length;
    });
    document.getElementById('stats-images').textContent = totalImages;
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
        updateSpecsForm();
    } else if (tab === 'list') {
        document.querySelector('.tabs button:nth-child(2)').classList.add('active');
        document.getElementById('tab-list').classList.add('active');
        renderProductList();
    } else if (tab === 'services') {
        document.querySelector('.tabs button:nth-child(3)').classList.add('active');
        document.getElementById('tab-services').classList.add('active');
        renderServiceList();
    } else if (tab === 'announcements') {
        document.querySelector('.tabs button:nth-child(4)').classList.add('active');
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
function addSpecRow(nameValue, valueValue, typeValue) {
    const container = document.getElementById('service-specs-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `
        <input type="text" class="spec-name" placeholder="Название (например: Время)" value="${nameValue || ''}" />
        <input type="text" class="spec-value" placeholder="Значение (например: 30 мин)" value="${valueValue || ''}" />
        <select class="spec-type">
            <option value="value" ${typeValue === 'value' ? 'selected' : ''}>Значение</option>
            <option value="text" ${typeValue === 'text' ? 'selected' : ''}>Текст</option>
        </select>
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
        const type = row.querySelector('.spec-type').value;
        if (name && value) {
            specs.push({ name, value, type });
        }
    });
    return specs;
}

// === ОБНОВЛЕНИЕ ФОРМЫ ХАРАКТЕРИСТИК ===
function updateSpecsForm() {
    const container = document.getElementById('product-specs-container');
    if (!container) return;
    
    const category = document.getElementById('product-category').value;
    const specs = categorySpecs[category] || defaultSpecs;
    
    container.innerHTML = `
        <div class="section-title" style="font-size:16px; margin-top:12px;">📊 Характеристики</div>
        <div class="spec-fixed-grid">
            ${specs.map(spec => `
                <div class="spec-field">
                    <label>${spec.name}</label>
                    <input type="text" class="spec-fixed-input" data-name="${spec.name}" placeholder="${spec.placeholder || 'Введите значение'}" />
                    <span class="hint">${spec.type === 'text' ? 'Введите текст или несколько значений через запятую' : ''}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function getFixedSpecs() {
    const inputs = document.querySelectorAll('#product-specs-container .spec-fixed-input');
    const specs = [];
    inputs.forEach(input => {
        const name = input.getAttribute('data-name');
        const value = input.value.trim();
        if (name && value) {
            specs.push({ name, value, type: 'text' });
        }
    });
    return specs;
}

// === ЗАГРУЗКА НЕСКОЛЬКИХ ФОТО ===
async function uploadProductImages() {
    const fileInput = document.getElementById('product-images-file');
    if (!fileInput) return;
    const files = fileInput.files;
    if (!files || files.length === 0) {
        alert('Выберите файлы с изображениями');
        return;
    }
    
    if (uploadedImages.length + files.length > 10) {
        alert('Максимум 10 фото на товар');
        return;
    }
    
    let loaded = 0;
    const total = files.length;
    
    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
            alert('Файл ' + file.name + ' слишком большой. Максимум 5MB');
            continue;
        }
        
        try {
            const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) { resolve(e.target.result); };
                reader.readAsDataURL(file);
            });
            
            const compressed = await compressImage(dataUrl, 800, 800, 0.7);
            uploadedImages.push(compressed);
            loaded++;
            updateImagePreview();
        } catch (e) {
            console.error('Ошибка загрузки файла:', e);
        }
    }
    
    if (loaded > 0) {
        alert('✅ Загружено ' + loaded + ' изображений!');
        fileInput.value = '';
    } else {
        alert('❌ Не удалось загрузить ни одного изображения');
    }
}

function updateImagePreview() {
    const container = document.getElementById('product-images-preview');
    if (!container) return;
    
    if (uploadedImages.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = uploadedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Фото ${index + 1}" />
            <button class="remove-img" onclick="removeImage(${index})">✕</button>
            <span class="img-index">${index + 1}</span>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
}

function clearImages() {
    uploadedImages = [];
    updateImagePreview();
    document.getElementById('product-images-file').value = '';
}

// === ТОВАРЫ ===
async function getProducts() {
    return await loadProductsFromAPI();
}

async function saveProducts(products) {
    const success = await saveProductsToAPI(products);
    if (success) {
        localStorage.setItem('snowboard_products_cache', JSON.stringify(products));
        renderProductList();
        updateStats();
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
        const displayPrice = p.price ? formatPrice(p.price) : '';
        const imageCount = p.images ? p.images.length : 0;
        return `
            <div class="item">
                <div class="info">
                    <strong>${p.name}</strong><br />
                    <span style="color:#007aff;">${displayPrice}</span>
                    <span style="color:#8e8e93; font-size:13px; margin-left:8px;">${p.category}</span>
                    <br /><small style="color:#8e8e93;">${p.specs ? p.specs.length : 0} характеристик${imageCount > 0 ? ' • 📷 ' + imageCount + ' фото' : ''}</small>
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
    let price = document.getElementById('product-price').value.trim();
    const desc = document.getElementById('product-desc').value.trim();
    const category = document.getElementById('product-category').value;
    const specs = getFixedSpecs();
    const imageUrl = document.getElementById('product-image-url').value.trim();

    if (!name || !price || !desc) {
        alert('Заполните название, цену и описание');
        return;
    }

    price = price.replace(/[^\d]/g, '');
    if (!price) {
        alert('Введите корректную цену (только цифры)');
        return;
    }

    let images = [];
    if (uploadedImages.length > 0) {
        images = uploadedImages.slice(0, 10);
    } else if (imageUrl) {
        images = [imageUrl];
    } else {
        images = ['https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'];
    }
    
    const products = await getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = { 
        id: newId, 
        name, 
        price: price + ' ₽',
        images: images,
        desc, 
        specs: specs,
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
        document.getElementById('product-images-file').value = '';
        clearImages();
        updateSpecsForm();
        
        await renderProductList();
        alert('✅ Товар "' + name + '" добавлен! Фото: ' + images.length);
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
    
    const priceClean = p.price ? p.price.replace(/[^\d]/g, '') : '';
    
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-price').value = priceClean;
    document.getElementById('product-image-url').value = '';
    document.getElementById('product-desc').value = p.desc;
    document.getElementById('product-category').value = p.category;
    
    // Загружаем существующие фото в превью
    uploadedImages = [];
    if (p.images && p.images.length > 0) {
        uploadedImages = p.images;
        updateImagePreview();
    }
    
    // Загружаем характеристики в форму
    setTimeout(() => {
        updateSpecsForm();
        if (p.specs && p.specs.length > 0) {
            const inputs = document.querySelectorAll('#product-specs-container .spec-fixed-input');
            inputs.forEach(input => {
                const name = input.getAttribute('data-name');
                const spec = p.specs.find(s => s.name === name);
                if (spec) {
                    input.value = spec.value;
                }
            });
        }
    }, 50);
    
    // Переключаемся на вкладку "Добавить"
    switchTab('products');
    
    // Удаляем старый товар
    products.splice(index, 1);
    await saveProducts(products);
    
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
        const displayPrice = p.price ? formatPrice(p.price) : '';
        const imageCount = p.images ? p.images.length : 0;
        return `
            <div class="item">
                <div class="info">
                    <strong>${p.name}</strong><br />
                    <span style="color:#007aff;">${displayPrice}</span>
                    <span style="color:#8e8e93; font-size:13px; margin-left:8px;">${p.category}</span>
                    <br /><small style="color:#8e8e93;">${p.specs ? p.specs.length : 0} характеристик${imageCount > 0 ? ' • 📷 ' + imageCount + ' фото' : ''}</small>
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
    let price = document.getElementById('service-price').value.trim();
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

    price = price.replace(/[^\d]/g, '');
    if (!price) {
        alert('Введите корректную цену (только цифры)');
        return;
    }

    const image = imageUrl || 'https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото';
    
    const products = await getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    products.push({ 
        id: newId, 
        name, 
        price: price + ' ₽',
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
            addSpecRow('', '');
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
    
    const priceClean = p.price ? p.price.replace(/[^\d]/g, '') : '';
    
    document.getElementById('service-name').value = p.name;
    document.getElementById('service-price').value = priceClean;
    document.getElementById('service-image-url').value = p.images ? p.images[0] : '';
    document.getElementById('service-desc').value = p.desc;
    
    const container = document.getElementById('service-specs-container');
    if (container) {
        container.innerHTML = '';
        if (p.specs && p.specs.length > 0) {
            p.specs.forEach(spec => {
                addSpecRow(spec.name, spec.value, spec.type || 'value');
            });
        } else {
            addSpecRow('', '');
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
        updateStats();
        updateSpecsForm();
        
    } else {
        alert('❌ Неверный пароль');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async function() {
    renderProductList();
    renderServiceList();
    loadCurrentAnnouncement();
    updateStats();
    updateSpecsForm();
    
    // Обновляем форму при смене категории
    document.getElementById('product-category').addEventListener('change', updateSpecsForm);
});

// === ОБНОВЛЕНИЕ ПРИ ИЗМЕНЕНИИ В LOCALSTORAGE ===
window.addEventListener('storage', async function(e) {
    if (e.key === 'snowboard_products') {
        renderProductList();
        renderServiceList();
        updateStats();
    }
});

// Экспортируем функции для глобального использования
window.getProducts = getProducts;
window.saveProducts = saveProducts;
window.addServiceSpecRow = addSpecRow;
window.removeServiceSpec = removeServiceSpec;
window.switchTab = switchTab;
window.sendAnnouncement = sendAnnouncement;
window.clearAnnouncement = clearAnnouncement;
window.loadCurrentAnnouncement = loadCurrentAnnouncement;
window.uploadProductImage = uploadProductImage;
window.uploadServiceImage = uploadServiceImage;
window.uploadProductImages = uploadProductImages;
window.removeImage = removeImage;
window.clearImages = clearImages;
window.addProduct = addProduct;
window.addService = addService;
window.deleteProduct = deleteProduct;
window.deleteService = deleteService;
window.editProduct = editProduct;
window.editService = editService;
window.loginAdmin = loginAdmin;
window.formatPrice = formatPrice;
window.compressImage = compressImage;
window.updateStats = updateStats;
window.updateSpecsForm = updateSpecsForm;
window.getFixedSpecs = getFixedSpecs;
