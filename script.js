// === КАТЕГОРИИ ===
const categories = [
    { name: 'Доски', icon: 'Доски.png' },
    { name: 'Ботинки', icon: 'Ботинки.png' },
    { name: 'Шлемы', icon: 'Шлем.png' },
    { name: 'Маски', icon: 'Маски.png' },
    { name: 'Чехлы', icon: 'Чехлы.png' },
    { name: 'Крепления', icon: 'Крепления.png' },
    { name: 'Сервис', icon: 'Сервис.png' },
    { name: 'Контакты', icon: 'Контакт.png' },
    { name: 'Конфигуратор', icon: 'Конфигуратор.png' }
];

localStorage.setItem('snowboard_categories', JSON.stringify(categories));

let currentTab = categories[0]?.name || 'Доски';
let currentImageIndex = 0;
let products = [];

const APP_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

// === ЗУМ ПЕРЕМЕННЫЕ ===
let currentZoom = 1;
let zoomPanX = 0;
let zoomPanY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartPanX = 0;
let dragStartPanY = 0;

// === ЗАГРУЗКА ТОВАРОВ ИЗ API ===
async function loadProductsFromAPI() {
    try {
        const response = await fetch(APP_URL + 'api/products');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        products = data;
        localStorage.setItem('snowboard_products_cache', JSON.stringify(products));
        return products;
    } catch (e) {
        console.error('Ошибка загрузки из API:', e);
        const cached = localStorage.getItem('snowboard_products_cache');
        if (cached) {
            products = JSON.parse(cached);
            return products;
        }
        return [];
    }
}

// === ЗАГРУЗКА ОПОВЕЩЕНИЯ ===
async function loadAnnouncementFromAPI() {
    try {
        const response = await fetch(APP_URL + 'api/announcement');
        const data = await response.json();
        
        const banner = document.getElementById('announcement-banner');
        const text = document.getElementById('announcement-text');
        
        if (banner && text && data.text && data.text !== '') {
            text.textContent = data.text;
            banner.style.display = 'block';
            return data.text;
        } else if (banner) {
            banner.style.display = 'none';
            return null;
        }
    } catch (e) {
        console.error('Ошибка загрузки оповещения:', e);
        return null;
    }
}

function closeAnnouncement() {
    const banner = document.getElementById('announcement-banner');
    if (banner) banner.style.display = 'none';
}

// === ФОРМАТИРОВАНИЕ ЦЕНЫ ===
function formatPrice(price) {
    if (!price) return '';
    let clean = price.replace(/[^\d]/g, '');
    if (!clean) return price;
    let formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formatted + ' ₽';
}

// === ПОЛУЧЕНИЕ ПАРАМЕТРОВ ТОВАРА ===
function getProductParams(product) {
    const params = {};
    if (product.specs) {
        product.specs.forEach(spec => {
            const name = spec.name.toLowerCase();
            if (name.includes('рост') || name.includes('длина')) {
                params.height = parseFloat(spec.value) || 0;
            }
            if (name.includes('вес')) {
                params.weight = parseFloat(spec.value) || 0;
            }
            if (name.includes('размер ноги') || name.includes('размер')) {
                params.footSize = parseFloat(spec.value) || 0;
            }
            if (name.includes('цена') || name.includes('стоимость')) {
                params.price = parseFloat(spec.value.replace(/[^\d]/g, '')) || 0;
            }
            if (name.includes('тип') || name.includes('стиль')) {
                params.style = spec.value.toLowerCase();
            }
        });
    }
    return params;
}

// === ПОДБОР КОМПЛЕКТОВ ===
function findComplexes(userData) {
    const boards = products.filter(p => p.category === 'Доски');
    const bindings = products.filter(p => p.category === 'Крепления');
    const boots = products.filter(p => p.category === 'Ботинки');
    
    const complexes = [];
    
    boards.forEach(board => {
        const boardPrice = parseFloat(board.price.replace(/[^\d]/g, '')) || 0;
        const boardParams = getProductParams(board);
        
        let boardMatch = true;
        if (boardParams.height) {
            const userHeight = userData.height || 0;
            if (userHeight > 0) {
                if (boardParams.height < userHeight - 10 || boardParams.height > userHeight + 10) {
                    boardMatch = false;
                }
            }
        }
        if (boardParams.weight) {
            const userWeight = userData.weight || 0;
            if (userWeight > 0) {
                if (boardParams.weight < userWeight - 10 || boardParams.weight > userWeight + 10) {
                    boardMatch = false;
                }
            }
        }
        if (boardParams.style && userData.style) {
            if (!boardParams.style.includes(userData.style.toLowerCase())) {
                boardMatch = false;
            }
        }
        
        if (!boardMatch) return;
        
        const budget = userData.budget || 200000;
        
        bindings.forEach(binding => {
            const bindingPrice = parseFloat(binding.price.replace(/[^\d]/g, '')) || 0;
            const bindingParams = getProductParams(binding);
            
            let bindingMatch = true;
            if (bindingParams.footSize) {
                const userFoot = userData.footSize || 0;
                if (userFoot > 0) {
                    if (bindingParams.footSize < userFoot - 1 || bindingParams.footSize > userFoot + 1) {
                        bindingMatch = false;
                    }
                }
            }
            
            if (!bindingMatch) return;
            
            boots.forEach(boot => {
                const bootPrice = parseFloat(boot.price.replace(/[^\d]/g, '')) || 0;
                const bootParams = getProductParams(boot);
                
                let bootMatch = true;
                if (bootParams.footSize) {
                    const userFoot = userData.footSize || 0;
                    if (userFoot > 0) {
                        if (bootParams.footSize < userFoot - 1 || bootParams.footSize > userFoot + 1) {
                            bootMatch = false;
                        }
                    }
                }
                
                if (!bootMatch) return;
                
                const totalPrice = boardPrice + bindingPrice + bootPrice;
                
                if (totalPrice > budget) return;
                
                let matchScore = 100;
                if (boardParams.height && userData.height) {
                    const diff = Math.abs(boardParams.height - userData.height);
                    matchScore -= diff * 2;
                }
                if (boardParams.weight && userData.weight) {
                    const diff = Math.abs(boardParams.weight - userData.weight);
                    matchScore -= diff * 1.5;
                }
                if (boardParams.style && userData.style) {
                    if (boardParams.style.includes(userData.style.toLowerCase())) {
                        matchScore += 10;
                    }
                }
                
                complexes.push({
                    board: board,
                    binding: binding,
                    boot: boot,
                    totalPrice: totalPrice,
                    matchScore: Math.max(0, matchScore),
                    boardParams: boardParams,
                    bindingParams: bindingParams,
                    bootParams: bootParams
                });
            });
        });
    });
    
    complexes.sort((a, b) => {
        if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
        return a.totalPrice - b.totalPrice;
    });
    
    return complexes;
}

// === РЕНДЕР КОНФИГУРАТОРА ===
function renderConfigurator() {
    const container = document.getElementById('catalog');
    if (!container) return;
    
    container.innerHTML = `
        <div class="configurator-form">
            <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 16px; text-shadow: 0 2px 8px rgba(0,0,0,0.3); text-align: center;">
                🔧 Подбор комплекта
            </h2>
            
            <div class="icon-label">
                <img src="Рост.png" alt="Рост" />
                <label>Ваш рост (см)</label>
            </div>
            <input type="range" id="config-height" min="140" max="210" value="175" step="1" />
            <div class="range-value" id="config-height-value">175 см</div>
            
            <div class="icon-label">
                <img src="Вес.png" alt="Вес" />
                <label>Ваш вес (кг)</label>
            </div>
            <input type="range" id="config-weight" min="40" max="130" value="75" step="1" />
            <div class="range-value" id="config-weight-value">75 кг</div>
            
            <div class="icon-label">
                <img src="Ноги.png" alt="Ноги" />
                <label>Размер ноги (EU)</label>
            </div>
            <select id="config-foot">
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42" selected>42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
            </select>
            
            <div class="icon-label">
                <img src="Деньги.png" alt="Деньги" />
                <label>Бюджет (₽)</label>
            </div>
            <input type="range" id="config-budget" min="50000" max="250000" value="150000" step="5000" />
            <div class="range-value" id="config-budget-value">150 000 ₽</div>
            
            <div class="icon-label">
                <img src="Стиль.png" alt="Стиль" />
                <label>Стиль катания</label>
            </div>
            <select id="config-style">
                <option value="">Любой</option>
                <option value="фрирайд">Фрирайд</option>
                <option value="парк">Парк</option>
                <option value="трасса">Трасса</option>
                <option value="универсал">Универсал</option>
            </select>
            
            <button class="submit-btn" onclick="runConfigurator()">🔍 Подобрать комплекты</button>
            <button class="reset-btn" onclick="resetConfigurator()">🔄 Сбросить параметры</button>
        </div>
        <div id="config-results"></div>
    `;
    
    // Обновляем значения слайдеров
    const heightSlider = document.getElementById('config-height');
    const weightSlider = document.getElementById('config-weight');
    const budgetSlider = document.getElementById('config-budget');
    
    if (heightSlider) {
        heightSlider.addEventListener('input', function() {
            document.getElementById('config-height-value').textContent = this.value + ' см';
        });
    }
    if (weightSlider) {
        weightSlider.addEventListener('input', function() {
            document.getElementById('config-weight-value').textContent = this.value + ' кг';
        });
    }
    if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
            document.getElementById('config-budget-value').textContent = formatPrice(this.value);
        });
    }
}

// === ЗАПУСК КОНФИГУРАТОРА ===
function runConfigurator() {
    const height = parseInt(document.getElementById('config-height').value) || 0;
    const weight = parseInt(document.getElementById('config-weight').value) || 0;
    const footSize = parseInt(document.getElementById('config-foot').value) || 0;
    const budget = parseInt(document.getElementById('config-budget').value) || 150000;
    const style = document.getElementById('config-style').value;
    
    const userData = {
        height: height,
        weight: weight,
        footSize: footSize,
        budget: budget,
        style: style
    };
    
    const complexes = findComplexes(userData);
    const resultsContainer = document.getElementById('config-results');
    
    if (!resultsContainer) return;
    
    if (complexes.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-message" style="margin-top: 16px; padding: 30px;">
                😕 По вашим параметрам комплектов не найдено.<br />
                Попробуйте изменить параметры или увеличить бюджет.
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div style="margin-top: 16px; color: rgba(255,255,255,0.8); font-size: 14px; text-align: center;">
            Найдено <strong style="color: #4fc3ff;">${complexes.length}</strong> комплектов
        </div>
    `;
    
    complexes.slice(0, 20).forEach((c, index) => {
        const card = document.createElement('div');
        card.className = 'complex-card';
        card.innerHTML = `
            <div class="complex-header">
                <span class="complex-name">🏂 Комплект #${index + 1}</span>
                <span class="complex-price">${formatPrice(String(c.totalPrice))}</span>
            </div>
            <div class="complex-image">
                <img src="${c.board.images && c.board.images.length > 0 ? c.board.images[0] : 'https://placehold.co/600x400/1a2a3a/ffffff?text=Доска'}" alt="${c.board.name}" onerror="this.src='https://placehold.co/600x400/1a2a3a/ffffff?text=Доска'" />
            </div>
            <div class="complex-items">
                <div class="complex-item">
                    <span class="item-icon">🏂</span>
                    <span class="item-name">${c.board.name}</span>
                    <span class="item-price">${formatPrice(c.board.price)}</span>
                </div>
                <div class="complex-item">
                    <span class="item-icon">🔗</span>
                    <span class="item-name">${c.binding.name}</span>
                    <span class="item-price">${formatPrice(c.binding.price)}</span>
                </div>
                <div class="complex-item">
                    <span class="item-icon">👢</span>
                    <span class="item-name">${c.boot.name}</span>
                    <span class="item-price">${formatPrice(c.boot.price)}</span>
                </div>
            </div>
            <div class="complex-desc">
                ${c.board.desc.substring(0, 80)}${c.board.desc.length > 80 ? '...' : ''}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                <span class="complex-match">⭐ Совместимость: ${Math.round(c.matchScore)}%</span>
                <button onclick="openComplexModal(${index})" style="background: rgba(79,195,255,0.2); border: 1px solid rgba(79,195,255,0.3); color: #4fc3ff; padding: 6px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; touch-action: manipulation;">
                    Подробнее
                </button>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
    
    window._complexes = complexes;
}

// === ОТКРЫТИЕ МОДАЛКИ КОМПЛЕКТА ===
function openComplexModal(index) {
    const complexes = window._complexes || [];
    const c = complexes[index];
    if (!c) return;
    
    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;
    
    body.innerHTML = `
        <h2 style="font-size: 22px;">🏂 Комплект #${index + 1}</h2>
        <div style="margin: 12px 0; padding: 12px; background: rgba(0,122,255,0.05); border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; color: #007aff;">
                <span>Итого:</span>
                <span>${formatPrice(String(c.totalPrice))}</span>
            </div>
            <div style="margin-top: 4px; font-size: 14px; color: #8e8e93;">
                ⭐ Совместимость: ${Math.round(c.matchScore)}%
            </div>
        </div>
        
        <div style="margin: 8px 0 4px 0; font-weight: 600; color: #1c1c1e;">📦 В комплект входит:</div>
        
        <div style="background: #f8f9fc; border-radius: 12px; padding: 12px; margin: 4px 0;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🏂</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${c.board.name}</div>
                    <div style="font-size: 13px; color: #8e8e93;">${formatPrice(c.board.price)}</div>
                </div>
                <button onclick="openModal(${c.board.id})" style="background: #007aff; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">Смотреть</button>
            </div>
        </div>
        
        <div style="background: #f8f9fc; border-radius: 12px; padding: 12px; margin: 4px 0;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🔗</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${c.binding.name}</div>
                    <div style="font-size: 13px; color: #8e8e93;">${formatPrice(c.binding.price)}</div>
                </div>
                <button onclick="openModal(${c.binding.id})" style="background: #007aff; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">Смотреть</button>
            </div>
        </div>
        
        <div style="background: #f8f9fc; border-radius: 12px; padding: 12px; margin: 4px 0 8px 0;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">👢</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${c.boot.name}</div>
                    <div style="font-size: 13px; color: #8e8e93;">${formatPrice(c.boot.price)}</div>
                </div>
                <button onclick="openModal(${c.boot.id})" style="background: #007aff; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">Смотреть</button>
            </div>
        </div>
        
        <div style="font-size: 14px; color: #3a3a3c; line-height: 1.5; margin-top: 8px; padding: 12px; background: #f0f0f5; border-radius: 12px;">
            <strong>📝 Описание комплекта:</strong><br />
            ${c.board.desc.substring(0, 120)}${c.board.desc.length > 120 ? '...' : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// === СБРОС КОНФИГУРАТОРА ===
function resetConfigurator() {
    document.getElementById('config-height').value = 175;
    document.getElementById('config-height-value').textContent = '175 см';
    document.getElementById('config-weight').value = 75;
    document.getElementById('config-weight-value').textContent = '75 кг';
    document.getElementById('config-foot').value = '42';
    document.getElementById('config-budget').value = 150000;
    document.getElementById('config-budget-value').textContent = '150 000 ₽';
    document.getElementById('config-style').value = '';
    document.getElementById('config-results').innerHTML = '';
}

// === РЕНДЕР КАТАЛОГА ===
function renderCatalog(category) {
    const container = document.getElementById('catalog');
    if (!container) return;
    
    if (category === 'Контакты') {
        renderContacts(container);
        return;
    }
    
    if (category === 'Конфигуратор') {
        renderConfigurator();
        return;
    }
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-message">Загрузка товаров...</div>';
        return;
    }
    
    const filtered = products.filter(p => p.category === category && !p.isContact);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-message">Нет товаров в этой категории</div>';
        return;
    }
    
    container.innerHTML = filtered.map(p => {
        const imageUrl = p.images && p.images.length > 0 && p.images[0] ? p.images[0] : 'https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото';
        const formattedPrice = formatPrice(p.price);
        return `
            <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
                <div class="product-image-wrapper">
                    <img src="${imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'" />
                </div>
                <h3>${p.name}</h3>
                <div class="price">${formattedPrice}</div>
                <div class="desc-preview">${p.desc}</div>
                <div class="specs">
                    ${p.specs && p.specs.length > 0 ? p.specs.slice(0, 2).map(s => `<span>${s.name}: ${s.value}</span>`).join('') : ''}
                </div>
                <div class="read-more">Читать полностью →</div>
            </div>
        `;
    }).join('');
}

function renderContacts(container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-message">Контакты не найдены</div>';
        return;
    }
    
    const contact = products.find(p => p.isContact);
    if (!contact) {
        container.innerHTML = '<div class="empty-message">Контакты не найдены</div>';
        return;
    }
    
    const icons = ['📱', '📍', '🕐', '📧'];
    
    container.innerHTML = `
        <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 18px; padding: 24px; border: 1px solid rgba(255,255,255,0.15);">
            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">📞 Контакты</h2>
            ${contact.specs.map((s, index) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: ${index < contact.specs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'};">
                    <span style="font-size: 22px; min-width: 36px;">${icons[index] || '📌'}</span>
                    <div style="flex: 1;">
                        <div style="color: rgba(255,255,255,0.7); font-size: 13px;">${s.name}</div>
                        <div style="color: #ffffff; font-size: 16px; font-weight: 500; text-shadow: 0 1px 4px rgba(0,0,0,0.3);">${s.value}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderNav() {
    const nav = document.getElementById('bottom-nav');
    if (!nav) return;
    
    if (!categories || categories.length === 0) {
        nav.innerHTML = '<span style="color:#8e8e93; padding:8px; font-size:14px;">Нет категорий</span>';
        return;
    }

    nav.innerHTML = categories.map(cat => {
        const isConfigurator = cat.name === 'Конфигуратор';
        return `
            <button class="nav-btn ${currentTab === cat.name ? 'active' : ''} ${isConfigurator ? 'configurator-btn' : ''}" data-tab="${cat.name}">
                <img src="${cat.icon}" alt="${cat.name}" onerror="this.src='https://placehold.co/32/cccccc/aaaaaa?text=?'" />
            </button>
        `;
    }).join('');

    nav.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.getAttribute('data-tab');
            if (tab) {
                currentTab = tab;
                renderCatalog(currentTab);
            }
        });
    });
}

// === МОДАЛЬНОЕ ОКНО ===
function openModal(productId) {
    if (!products || products.length === 0) {
        console.error('Товары не загружены');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Товар с id', productId, 'не найден');
        return;
    }

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;
    
    currentImageIndex = 0;
    
    const hasMultipleImages = product.images && product.images.length > 1;
    const images = product.images || ['https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'];

    body.innerHTML = `
        <div class="modal-image-container">
            <img id="modal-main-image" src="${images[0]}" alt="${product.name}" onerror="this.src='https://placehold.co/600x400/1a2a3a/ffffff?text=Нет+фото'" onclick="openZoom(this.src)" />
            ${hasMultipleImages ? `
                <button class="carousel-btn carousel-left" onclick="changeImage(${product.id}, -1)">‹</button>
                <button class="carousel-btn carousel-right" onclick="changeImage(${product.id}, 1)">›</button>
                <div class="carousel-dots">
                    ${images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToImage(${product.id}, ${idx})"></span>`).join('')}
                </div>
            ` : ''}
            <div class="zoom-hint">🔍 Нажми на фото для увеличения</div>
        </div>
        <h2>${product.name}</h2>
        <div class="modal-price">${formatPrice(product.price)}</div>
        <div class="modal-desc">${product.desc}</div>
        <div class="modal-specs">
            ${product.specs && product.specs.length > 0 ? product.specs.map(s => `<div class="spec-item"><span class="spec-name">${s.name}</span><span class="spec-value">${s.value}</span></div>`).join('') : ''}
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.dataset.productId = productId;
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function changeImage(productId, direction) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) return;
    
    const images = product.images;
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    
    const mainImg = document.getElementById('modal-main-image');
    if (mainImg) {
        mainImg.src = images[currentImageIndex];
        mainImg.alt = product.name;
        mainImg.onclick = function() { openZoom(this.src); };
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentImageIndex);
    });
}

function goToImage(productId, index) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || index >= product.images.length) return;
    
    currentImageIndex = index;
    const mainImg = document.getElementById('modal-main-image');
    if (mainImg) {
        mainImg.src = product.images[index];
        mainImg.alt = product.name;
        mainImg.onclick = function() { openZoom(this.src); };
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

// === ПРИБЛИЖЕНИЕ ===
function openZoom(imageSrc) {
    if (!imageSrc || imageSrc.includes('placehold.co')) return;
    
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    const zoomLevel = document.getElementById('zoom-level');
    
    if (!zoomModal || !zoomImage) return;
    
    currentZoom = 1;
    zoomPanX = 0;
    zoomPanY = 0;
    if (zoomLevel) zoomLevel.textContent = '100%';
    
    zoomImage.src = imageSrc;
    zoomImage.style.transform = `scale(${currentZoom}) translate(${zoomPanX}px, ${zoomPanY}px)`;
    zoomImage.style.cursor = 'grab';
    
    zoomModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeZoom() {
    const zoomModal = document.getElementById('image-zoom-modal');
    if (zoomModal) zoomModal.style.display = 'none';
    document.body.style.overflow = 'hidden';
    currentZoom = 1;
    zoomPanX = 0;
    zoomPanY = 0;
    const zoomImage = document.getElementById('zoom-image');
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomImage) {
        zoomImage.style.transform = 'scale(1) translate(0px, 0px)';
        zoomImage.style.cursor = 'grab';
    }
    if (zoomLevel) zoomLevel.textContent = '100%';
}

function zoomIn() {
    const zoomImage = document.getElementById('zoom-image');
    const zoomLevel = document.getElementById('zoom-level');
    if (!zoomImage) return;
    currentZoom = Math.min(currentZoom + 0.25, 5);
    zoomImage.style.transform = `scale(${currentZoom}) translate(${zoomPanX}px, ${zoomPanY}px)`;
    if (zoomLevel) zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
}

function zoomOut() {
    const zoomImage = document.getElementById('zoom-image');
    const zoomLevel = document.getElementById('zoom-level');
    if (!zoomImage) return;
    currentZoom = Math.max(currentZoom - 0.25, 0.5);
    if (currentZoom === 1) {
        zoomPanX = 0;
        zoomPanY = 0;
    }
    zoomImage.style.transform = `scale(${currentZoom}) translate(${zoomPanX}px, ${zoomPanY}px)`;
    if (zoomLevel) zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
}

function resetZoom() {
    const zoomImage = document.getElementById('zoom-image');
    const zoomLevel = document.getElementById('zoom-level');
    if (!zoomImage) return;
    currentZoom = 1;
    zoomPanX = 0;
    zoomPanY = 0;
    zoomImage.style.transform = 'scale(1) translate(0px, 0px)';
    zoomImage.style.cursor = 'grab';
    if (zoomLevel) zoomLevel.textContent = '100%';
}

function initZoomDrag() {
    const zoomImage = document.getElementById('zoom-image');
    if (!zoomImage) return;
    
    zoomImage.addEventListener('mousedown', function(e) {
        e.preventDefault();
        if (currentZoom <= 1) return;
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartPanX = zoomPanX;
        dragStartPanY = zoomPanY;
        zoomImage.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        zoomPanX = dragStartPanX + (dx / currentZoom);
        zoomPanY = dragStartPanY + (dy / currentZoom);
        zoomImage.style.transform = `scale(${currentZoom}) translate(${zoomPanX}px, ${zoomPanY}px)`;
    });
    
    window.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            const zoomImageEl = document.getElementById('zoom-image');
            if (zoomImageEl) zoomImageEl.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        }
    });
    
    let touchStartX = 0, touchStartY = 0;
    let touchStartPanX = 0, touchStartPanY = 0;
    let isTouching = false;
    
    zoomImage.addEventListener('touchstart', function(e) {
        if (currentZoom <= 1) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartPanX = zoomPanX;
        touchStartPanY = zoomPanY;
        isTouching = true;
    }, { passive: true });
    
    zoomImage.addEventListener('touchmove', function(e) {
        if (!isTouching || currentZoom <= 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        zoomPanX = touchStartPanX + (dx / currentZoom);
        zoomPanY = touchStartPanY + (dy / currentZoom);
        zoomImage.style.transform = `scale(${currentZoom}) translate(${zoomPanX}px, ${zoomPanY}px)`;
    }, { passive: false });
    
    zoomImage.addEventListener('touchend', function() {
        isTouching = false;
    }, { passive: true });
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async function() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');

    await loadProductsFromAPI();
    await loadAnnouncementFromAPI();

    let splashTimer = setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                const video = document.getElementById('splash-video');
                if (video) video.pause();
                if (app) {
                    app.style.display = 'flex';
                    setTimeout(() => {
                        app.classList.add('visible');
                    }, 50);
                    renderNav();
                    if (currentTab) renderCatalog(currentTab);
                }
            }, 400);
        }
    }, 3000);

    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomClose = document.getElementById('zoom-close');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');
    
    if (zoomClose) zoomClose.addEventListener('click', closeZoom);
    if (zoomModal) zoomModal.addEventListener('click', function(e) {
        if (e.target === this) closeZoom();
    });
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);
    
    initZoomDrag();
});

window.refreshCatalog = function() {
    if (currentTab) renderCatalog(currentTab);
};

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

window.openZoom = openZoom;
window.closeZoom = closeZoom;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;
window.runConfigurator = runConfigurator;
window.resetConfigurator = resetConfigurator;
window.openComplexModal = openComplexModal;
