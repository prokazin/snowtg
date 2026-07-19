// === ДАННЫЕ (можно загружать из LocalStorage или API) ===
let products = JSON.parse(localStorage.getItem('snowboard_products')) || [
    {
        id: 1,
        name: 'Burton Custom 2025',
        price: '54 990 ₽',
        image: 'https://placehold.co/600x400/1a3a4a/white?text=Burton+Custom',
        desc: 'Легендарная модель для фрирайда и парка.',
        specs: ['Длина: 156 см', 'Жесткость: 7/10', 'Camber'],
        category: 'boards'
    },
    {
        id: 2,
        name: 'Union Force',
        price: '24 500 ₽',
        image: 'https://placehold.co/600x400/2a4a5a/white?text=Union+Force',
        desc: 'Надежные крепления для любого стиля катания.',
        specs: ['Вес: 1.2 кг', 'Материал: Алюминий'],
        category: 'bindings'
    },
    {
        id: 3,
        name: 'Adidas Tactical ADV',
        price: '19 990 ₽',
        image: 'https://placehold.co/600x400/3a5a6a/white?text=Adidas+ADV',
        desc: 'Ботинки с системой быстрой шнуровки.',
        specs: ['Размер: 42-46', 'Жесткость: 6/10'],
        category: 'boots'
    },
    {
        id: 4,
        name: 'Oakley MOD1',
        price: '14 200 ₽',
        image: 'https://placehold.co/600x400/4a6a7a/white?text=Oakley+MOD1',
        desc: 'Легкий шлем с вентиляцией.',
        specs: ['Вес: 380 г', 'Сертификат: CE'],
        category: 'helmets'
    }
];

let currentTab = 'boards';

// === Рендер каталога ===
function renderCatalog(category) {
    const container = document.getElementById('catalog');
    const filtered = products.filter(p => p.category === category);

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#8e8e93;">Нет товаров в этой категории</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <h3>${p.name}</h3>
            <div class="price">${p.price}</div>
            <div class="desc">${p.desc}</div>
            <div class="specs">${p.specs.map(s => `<span>${s}</span>`).join('')}</div>
        </div>
    `).join('');
}

// === Навигация ===
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTab = this.dataset.tab;
        renderCatalog(currentTab);
    });
});

// === Загрузочный экран ===
function updateCountdown() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 1); // 1 декабря
    if (now > target) target.setFullYear(target.getFullYear() + 1);
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Меняем подпись
    const msg = document.getElementById('splash-message');
    if (days < 30) msg.textContent = '❄️ Сезон уже близко!';
    else if (days < 60) msg.textContent = '⛷️ Готовь снаряжение!';
    else msg.textContent = '🏔️ До первого снега осталось...';
}

// === Проверка: 1 декабря — скрываем сплеш ===
function shouldHideSplash() {
    const now = new Date();
    return now.getMonth() === 11 && now.getDate() === 1;
}

// === Инициализация ===
window.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');

    if (shouldHideSplash()) {
        splash.style.display = 'none';
        app.style.display = 'block';
        renderCatalog(currentTab);
        return;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Закрытие через 5 сек или по кнопке
    const closeBtn = document.getElementById('close-splash');
    let splashTimer = setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            app.style.display = 'block';
            renderCatalog(currentTab);
        }, 400);
    }, 5000);

    closeBtn.addEventListener('click', function() {
        clearTimeout(splashTimer);
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            app.style.display = 'block';
            renderCatalog(currentTab);
        }, 400);
    });
});
