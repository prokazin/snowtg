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
            // Дефолтные товары
            const defaultProducts = [
                {
                    id: 1,
                    name: 'Burton Custom 2025',
                    price: '54 990 ₽',
                    image: 'https://placehold.co/600x400/1a3a4a/white?text=Burton+Custom',
                    desc: 'Легендарная модель для фрирайда и парка. Идеально подходит для катания по целине и в парке. Универсальная геометрия позволяет уверенно чувствовать себя на любом склоне. Сердечник из дерева с карбоновыми вставками обеспечивает отличную упругость и контроль.',
                    specs: [
                        { name: 'Длина', value: '156 см' },
                        { name: 'Жесткость', value: '7/10' },
                        { name: 'Прогиб', value: 'Camber' }
                    ],
                    category: 'Доски'
                },
                {
                    id: 2,
                    name: 'Union Force',
                    price: '24 500 ₽',
                    image: 'https://placehold.co/600x400/2a4a5a/white?text=Union+Force',
                    desc: 'Надежные крепления для любого стиля катания. Алюминиевая база с высоким качеством обработки. Быстрая регулировка под любой размер ботинка. Отличная передача усилий на кант.',
                    specs: [
                        { name: 'Вес', value: '1.2 кг' },
                        { name: 'Материал', value: 'Алюминий' }
                    ],
                    category: 'Крепления'
                },
                {
                    id: 3,
                    name: 'Adidas Tactical ADV',
                    price: '19 990 ₽',
                    image: 'https://placehold.co/600x400/3a5a6a/white?text=Adidas+ADV',
                    desc: 'Ботинки с системой быстрой шнуровки и анатомической стелькой. Превосходная поддержка голеностопа и комфорт в течение всего дня катания. Внешняя оболочка из прочного материала защищает от влаги.',
                    specs: [
                        { name: 'Размер', value: '42-46' },
                        { name: 'Жесткость', value: '6/10' }
                    ],
                    category: 'Ботинки'
                },
                {
                    id: 4,
                    name: 'Oakley MOD1',
                    price: '14 200 ₽',
                    image: 'https://placehold.co/600x400/4a6a7a/white?text=Oakley+MOD1',
                    desc: 'Легкий шлем с вентиляционной системой и защитой от ударов. Интегрированная система регулировки размера. Внутренняя подкладка из гипоаллергенных материалов отводит влагу.',
                    specs: [
                        { name: 'Вес', value: '380 г' },
                        { name: 'Сертификат', value: 'CE' }
                    ],
                    category: 'Шлемы'
                },
                {
                    id: 5,
                    name: 'Dakine Low Rider',
                    price: '8 900 ₽',
                    image: 'https://placehold.co/600x400/4a5a6a/white?text=Dakine+Low+Rider',
                    desc: 'Универсальный чехол для сноуборда. Защищает доску при транспортировке. Имеет дополнительные карманы для креплений и инструментов.',
                    specs: [
                        { name: 'Длина', value: '156 см' },
                        { name: 'Материал', value: 'Polyester' }
                    ],
                    category: 'Чехлы'
                }
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
                <br /><small style="color:#8e8e93;">${p.specs.length} характеристик</small>
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

    const image = imageUrl || 'https://placehold.co/600x400/cccccc/aaaaaa?text=No+Image';
    
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
