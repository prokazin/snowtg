const ADMIN_PASSWORD = 'admin123'; // Смените на свой пароль

function loginAdmin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        renderAdminList();
    } else {
        alert('Неверный пароль');
    }
}

function getProducts() {
    return JSON.parse(localStorage.getItem('snowboard_products')) || [];
}

function saveProducts(data) {
    localStorage.setItem('snowboard_products', JSON.stringify(data));
    // Обновляем глобальную переменную в родительском окне (если открыто)
    if (window.opener) {
        window.opener.products = data;
    }
    renderAdminList();
}

function renderAdminList() {
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
    const image = document.getElementById('product-image').value.trim();
    const desc = document.getElementById('product-desc').value.trim();
    const specsRaw = document.getElementById('product-specs').value.trim();
    const category = document.getElementById('product-category').value;

    if (!name || !price || !image || !desc) {
        alert('Заполните все поля');
        return;
    }

    const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()) : [];
    const products = getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, price, image, desc, specs, category });
    saveProducts(products);
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-desc').value = '';
    document.getElementById('product-specs').value = '';
    renderAdminList();
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
    document.getElementById('product-image').value = p.image;
    document.getElementById('product-desc').value = p.desc;
    document.getElementById('product-specs').value = p.specs.join(', ');
    document.getElementById('product-category').value = p.category;
    // Удаляем старый и добавляем заново (упрощенно)
    deleteProduct(index);
}
