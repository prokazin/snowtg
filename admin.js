const ADMIN_PASSWORD = 'admin123';

// === КАТЕГОРИИ ===
function getCategories() {
    return JSON.parse(localStorage.getItem('snowboard_categories')) || [];
}

function saveCategories(data) {
    localStorage.setItem('snowboard_categories', JSON.stringify(data));
    renderCategoryList();
    updateCategorySelect();
}

function renderCategoryList() {
    const list = document.getElementById('category-list');
    const categories = getCategories();
    if (categories.length === 0) {
        list.innerHTML = '<p style="color:#8e8e93;">Нет категорий</p>';
        return;
    }
    list.innerHTML = categories.map((cat, i) => `
        <div class="category-item">
            <img src="${cat.icon}" alt="${cat.name}" onerror="this.src='https://placehold.co/32/cccccc/aaaaaa?text=?'" />
            <span><strong>${cat.name}</strong></span>
            <button onclick="deleteCategory(${i})" style="width:auto; padding:4px 12px; background:#ff3b30; margin-left:auto;">🗑️</button>
        </div>
    `).join('');
}

function updateCategorySelect() {
    const select = document.getElementById('product-category');
    const categories = getCategories();
    select.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function addCategory() {
    const name = document.getElementById('category-name').value.trim();
    const iconUrl = document.getElementById('category-icon-url').value.trim();
    if (!name) { alert('Введите название категории'); return; }
    const categories = getCategories();
    // Если иконка не указана, используем placeholder
    const icon = iconUrl || 'https://placehold.co/32/cccccc/aaaaaa?text=?';
    categories.push({ name, icon });
    saveCategories(categories);
    document.getElementById('category-name').value = '';
    document.getElementById('category-icon-url').value = '';
    renderCategoryList();
    updateCategorySelect();
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
    if (!file) { alert('Выберите файл'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('category-icon-url').value = e.target.result;
        alert('Иконка загружена!');
    };
    reader.readAsDataURL(file);
}

// === ТОВАРЫ ===
function getProducts() {
    return JSON.parse(localStorage.getItem('snowboard_products')) || [];
}

function saveProducts(data) {
    localStorage.setItem('snowboard_products', JSON.stringify(data));
    renderProductList();
}

function renderProductList() {
    const list = document.getElementById('product-list');
    const products = getProducts();
    if (products.length === 0) {
        list.innerHTML = '<p style="color:#8e8e93;">Нет товаров</p>';
        return;
    }
    list.innerHTML = products.map((p, i) => `
        <div class="item">
            <strong>${p.name}</strong> — ${p.price}
            <br><small>${p.category}</small>
            <div>
                <button class="edit-btn" onclick="editProduct(${i})">✏️</button>
                <button onclick="deleteProduct(${i})">🗑️</button>
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

    // Если есть загруженное изображение в dataURL, используем его
    const image = imageUrl || 'https://placehold.co/600x400/cccccc/aaaaaa?text=No+Image';
    const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()) : [];
    const products = getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, price, image, desc, specs, category });
    saveProducts(products);
    
    // Очистка
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image-url').value = '';
    document.getElementById('product-desc').value = '';
    document.getElementById('product-specs').value = '';
    document.getElementById('product-image-file').value = '';
    renderProductList();
}

function uploadProductImage() {
    const fileInput = document.getElementById('product-image-file');
    const file = fileInput.files[0];
    if (!file) { alert('Выберите файл'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('product-image-url').value = e.target.result;
        alert('Изображение загружено!');
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
    deleteProduct(index);
}

// === ВХОД ===
function loginAdmin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        renderCategoryList();
        updateCategorySelect();
        renderProductList();
    } else {
        alert('Неверный пароль');
    }
}

// Инициализация при загрузке (если уже залогинен)
document.addEventListener('DOMContentLoaded', function() {
    // Если есть сохраненные данные, подгружаем
    renderCategoryList();
    updateCategorySelect();
    renderProductList();
});
