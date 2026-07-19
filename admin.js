const ADMIN_PASSWORD = 'admin123';

// === РАБОТА С КАТЕГОРИЯМИ ===
function getCategories() {
    try {
        const data = localStorage.getItem('snowboard_categories');
        if (!data) {
            // Если нет данных, создаем дефолтные
            const defaultCategories = [
                { name: 'Доски', icon: 'Доски.png' },
                { name: 'Ботинки', icon: 'Ботинки.png' },
                { name: 'Шлемы', icon: 'Шлем.png' },
                { name: 'Маски', icon: 'Маски.png' }
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

function saveCategories(categories) {
    try {
        localStorage.setItem('snowboard_categories', JSON.stringify(categories));
        // Обновляем список на странице
        renderCategoryList();
        updateCategorySelect();
        // Обновляем навигацию в основном приложении
        if (window.opener && !window.opener.closed) {
            window.opener.categories = categories;
            window.opener.renderNav();
            if (window.opener.currentTab) {
                window.opener.renderCatalog(window.opener.currentTab);
            }
        }
    } catch (e) {
        console.error('Ошибка сохранения категорий:', e);
        alert('Ошибка сохранения категорий');
    }
}

function renderCategoryList() {
    const list = document.getElementById('category-list');
    if (!list) return;
    
    const categories = getCategories();
    if (!categories || categories.length === 0) {
        list.innerHTML = '<p style="color:#8e8e93; padding:10px 0;">Нет категорий</p>';
        return;
    }
    
    list.innerHTML = categories.map((cat, i) => `
        <div class="category-item">
            <img src="${cat.icon}" alt="${cat.name}" onerror="this.src='https://placehold.co/32/cccccc/aaaaaa?text=?'" />
            <span class="cat-name">${cat.name}</span>
            <button onclick="deleteCategory(${i})" style="background:#ff3b30;">🗑️ Удалить</button>
        </div>
    `).join('');
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

function addCategory() {
    const nameInput = document.getElementById('category-name');
    const iconInput = document.getElementById('category-icon-url');
    
    const name = nameInput.value.trim();
    let icon = iconInput.value.trim();
    
    if (!name) {
        alert('Введите название категории');
        return;
    }
    
    // Если иконка не указана, используем placeholder
    if (!icon) {
        icon = 'https://placehold.co/32/cccccc/aaaaaa?text=?';
    }
    
    const categories = getCategories();
    // Проверяем, нет ли уже такой категории
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('Категория с таким названием уже существует');
        return;
    }
    
    categories.push({ name, icon });
    saveCategories(categories);
    
    // Очищаем поля
    nameInput.value = '';
    iconInput.value = '';
    document.getElementById('category-icon-file').value = '';
    
    // Показываем сообщение об успехе
    alert('✅ Категория "' + name + '" добавлена!');
}

function deleteCategory(index) {
    if (!confirm('Удалить категорию?')) return;
    const categories = getCategories();
    categories.splice(index, 1);
    saveCategories(categories);
}

// Загрузка иконки категории через файл
function uploadCategoryIcon() {
    const fileInput = document.getElementById('category-icon-file');
    const file = fileInput.files[0];
    if (!file) {
        alert('Выберите файл с иконкой');
        return;
    }
    
    // Проверяем размер файла (максимум 1MB)
    if (file.size > 1024 * 1024) {
        alert('Файл слишком большой. Максимум 1MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('category-icon-url').value = e.target.result;
        alert('✅ Иконка загружена!');
    };
    reader.onerror = function() {
        alert('Ошибка загрузки файла');
    };
    reader.readAsDataURL(file);
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
    const specsRaw = document.getElementById('product-specs').value.trim();
    const category = document.getElementById('product-category').value;

    if (!name || !price || !desc) {
        alert('Заполните название, цену и описание');
        return;
    }

    const image = imageUrl || 'https://placehold.co/600x400/cccccc/aaaaaa?text=No+Image';
    const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()).filter(s => s) : [];
    
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
    document.getElementById('product-specs').value = '';
    document.getElementById('product-image-file').value = '';
    
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
    document.getElementById('product-specs').value = p.specs.join(', ');
    document.getElementById('product-category').value = p.category;
    
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
        renderCategoryList();
        updateCategorySelect();
        renderProductList();
        
        // Приводим к одному стилю кнопку
        document.querySelector('#admin-panel .section-title:first-of-type').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('❌ Неверный пароль');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    // Если уже есть сохраненный пароль (для удобства)
    // Просто загружаем данные в фоне
    
    // Проверяем, есть ли данные
    if (localStorage.getItem('snowboard_categories')) {
        // Данные есть, ничего не делаем
    }
    
    // Для удобства: если админка открыта, подгружаем данные
    renderCategoryList();
    updateCategorySelect();
    renderProductList();
});

// === ОБНОВЛЕНИЕ ДАННЫХ ИЗ ДРУГИХ ВКЛАДОК ===
window.addEventListener('storage', function(e) {
    if (e.key === 'snowboard_categories') {
        renderCategoryList();
        updateCategorySelect();
    }
    if (e.key === 'snowboard_products') {
        renderProductList();
    }
});

// Экспортируем функции для использования из консоли
window.getCategories = getCategories;
window.saveCategories = saveCategories;
window.getProducts = getProducts;
window.saveProducts = saveProducts;
