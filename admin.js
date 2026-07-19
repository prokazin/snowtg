const ADMIN_PASSWORD = 'admin123';

// === КАТЕГОРИИ (берутся из основной страницы) ===
function getCategories() {
    try {
        const data = localStorage.getItem('snowboard_categories');
        if (!data) {
            // Дефолтные категории
            const defaultCategories = [
                { name: 'Доски', icon: 'Доски.png' },
                { name: 'Ботинки', icon: 'Ботинки.png' },
                { name: 'Шлемы', icon: 'Шлем.png' },
                { name: 'Маски', icon: 'Маски.png' },
                { name: 'Чехлы', icon: 'Чехлы.png' },
                { name: 'Крепления', icon: 'Крепления.png' }
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

function updateCategorySelect() {
    const select = document.getElementById('product-category');
    if (!select) return;
    
    const categories = getCategories();
    if (!categories || categories.length === 0) {
        select.innerHTML = '<option value="">Нет категорий</option>';
        return;
    }
    
    select.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

// === РАБОТА С ХАРАКТЕРИСТИКАМИ ===
function addSpecRow(nameValue, valueValue) {
    const container = document.getElementById('specs-container');
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
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Должна быть хотя бы одна характеристика');
    }
}

function getSpecs() {
    const rows = document.querySelectorAll('.spec-row');
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

// === РАБОТА С ТОВАРАМИ ===
function getProducts() {
    try {
        const data = localStorage.getItem('snowboard_products');
        if (!data) {
            // Дефолтные товары (будут созданы при первом запуске)
            const defaultProducts = [
                // Товары будут созданы из script.js
            ];
            localStorage.setItem('snowboard_products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        return JSON.parse(data);
    } catch (e) {
        console.error('Ошибка загрузки товаров:', e);
        return [];
    }
}

function saveProducts(products) {
    try {
        localStorage.setItem('snowboard_products', JSON.stringify(products));
        renderProductList();
        // Обновляем в основном приложении
        if (window.opener && !window.opener.closed) {
            window.opener.products = products;
            if (window.opener.currentTab) {
                window.opener.renderCatalog(window.opener.currentTab);
            }
        }
    } catch (e) {
        console.error('Ошибка сохранения товаров:', e);
        alert('Ошибка сохранения товаров');
    }
}

function renderProductList() {
    const list = document.getElementById('product-list');
    if (!list) return;
    
    const products = getProducts();
    if (!products || products.length === 0) {
        list.innerHTML = '<p style="color:#8e8e93; padding:10px 0;">Нет товаров</p>';
        return;
    }
    
    list.innerHTML = products.map((p, i) => `
        <div class="item">
            <div class="info">
                <strong>${p.name}</strong><br />
                <span style="color:#007aff;">${p.price}</span>
                <span style="color:#8e8e93; font-size:13px; margin-left:8px;">${p.category}</span>
                <br /><small style="color:#8e8e93;">${p.specs ? p.specs.length : 0} характеристик</small>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editProduct(${i})">✏️</button>
                <button class="delete-btn" onclick="deleteProduct(${i})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addProduct() {
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

    if (!category) {
        alert('Выберите категорию');
        return;
    }

    if (specs.length === 0) {
        alert('Добавьте хотя бы одну характеристику');
        return;
    }

    const image = imageUrl || 'https://placehold.co/600x400/ffffff/cccccc?text=No+Image';
    
    const products = getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    products.push({ 
        id: newId, 
        name, 
        price, 
        image, 
        desc, 
        specs, 
        category 
    });
    
    saveProducts(products);
    
    // Очистка
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image-url').value = '';
    document.getElementById('product-desc').value = '';
    document.getElementById('product-image-file').value = '';
    
    // Очищаем характеристики, оставляем одну пустую
    const container = document.getElementById('specs-container');
    container.innerHTML = '';
    addSpecRow('', '');
    
    alert('✅ Товар "' + name + '" добавлен!');
}

function uploadProductImage() {
    const fileInput = document.getElementById('product-image-file');
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

function deleteProduct(index) {
    if (!confirm('Удалить товар?')) return;
    const products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
}

function editProduct(index) {
    const products = getProducts();
    const p = products[index];
    
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-image-url').value = p.image;
    document.getElementById('product-desc').value = p.desc;
    document.getElementById('product-category').value = p.category;
    
    // Загружаем характеристики
    const container = document.getElementById('specs-container');
    container.innerHTML = '';
    if (p.specs && p.specs.length > 0) {
        p.specs.forEach(spec => {
            addSpecRow(spec.name, spec.value);
        });
    } else {
        addSpecRow('', '');
    }
    
    // Удаляем старый товар
    products.splice(index, 1);
    saveProducts(products);
    
    // Скроллим к форме добавления
    document.getElementById('product-name').scrollIntoView({ behavior: 'smooth' });
}

// === ВХОД В АДМИНКУ ===
function loginAdmin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        
        // Загружаем все данные
        updateCategorySelect();
        renderProductList();
        
        // Добавляем одну пустую характеристику
        const container = document.getElementById('specs-container');
        container.innerHTML = '';
        addSpecRow('', '');
        
    } else {
        alert('❌ Неверный пароль');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем категории
    updateCategorySelect();
    renderProductList();
});

// === ОБНОВЛЕНИЕ ДАННЫХ ИЗ ДРУГИХ ВКЛАДОК ===
window.addEventListener('storage', function(e) {
    if (e.key === 'snowboard_products') {
        renderProductList();
    }
});

// Экспортируем функции
window.getProducts = getProducts;
window.saveProducts = saveProducts;
window.addSpecRow = addSpecRow;
window.removeSpec = removeSpec;
