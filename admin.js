// === УНИКАЛЬНЫЙ КЛЮЧ (СОВПАДАЕТ С ОСНОВНЫМ) ===
const STORAGE_KEY = 'snowboard_shop_products_v1';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const list = document.getElementById('product-list');
    let editIndex = null;

    function getProducts() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) {}
        return [];
    }

    function saveProducts(products) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (e) {
            console.warn('Не удалось сохранить');
        }
    }

    function loadProductsList() {
        const products = getProducts();
        if (!products.length) {
            list.innerHTML = `<div style="text-align:center; opacity:0.5; padding:30px 0;">Нет товаров. Добавьте первый!</div>`;
            return;
        }

        list.innerHTML = products.map((p, index) => `
            <div class="admin-item">
                <div class="item-info">
                    <strong>${escapeHtml(p.image || '🏂')} ${escapeHtml(p.name || 'Без названия')}</strong><br>
                    <span style="opacity:0.6; font-size:14px;">${escapeHtml(p.price || '0 ₽')} • ${escapeHtml(p.category || '')}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" data-index="${index}">✎ Редакт</button>
                    <button class="delete-btn" data-index="${index}">✕ Удалить</button>
                </div>
            </div>
        `).join('');

        // Удаление
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                if (confirm('Удалить товар?')) {
                    const prods = getProducts();
                    prods.splice(index, 1);
                    saveProducts(prods);
                    loadProductsList();
                    form.reset();
                    document.getElementById('product-id').value = '';
                    editIndex = null;
                }
            });
        });

        // Редактирование
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                const prods = getProducts();
                const p = prods[index];
                if (!p) return;
                
                document.getElementById('product-id').value = index;
                document.getElementById('product-name').value = p.name || '';
                document.getElementById('product-price').value = p.price || '';
                document.getElementById('product-image').value = p.image || '';
                document.getElementById('product-category').value = p.category || 'boards';
                document.getElementById('product-desc').value = p.desc || '';
                document.getElementById('product-specs').value = p.specs || '';
                editIndex = index;
                
                // Скролл к форме
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // === ОБРАБОТКА ФОРМЫ ===
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('product-name').value.trim();
        const price = document.getElementById('product-price').value.trim();
        const image = document.getElementById('product-image').value.trim() || '🏂';
        const category = document.getElementById('product-category').value;
        const desc = document.getElementById('product-desc').value.trim();
        const specs = document.getElementById('product-specs').value.trim();
        const id = document.getElementById('product-id').value;

        if (!name || !price) {
            alert('Заполните название и цену!');
            return;
        }

        let prods = getProducts();
        const newProduct = { name, price, image, category, desc, specs };

        if (id !== '' && id !== null) {
            const index = parseInt(id);
            if (index >= 0 && index < prods.length) {
                prods[index] = newProduct;
            }
        } else {
            prods.push(newProduct);
        }

        saveProducts(prods);
        loadProductsList();
        form.reset();
        document.getElementById('product-id').value = '';
        editIndex = null;
    });

    // === ИНИЦИАЛИЗАЦИЯ ===
    loadProductsList();
});
