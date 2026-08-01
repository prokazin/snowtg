// === ПОЛНЫЙ КОД ДЛЯ CLOUDFLARE WORKER ===

const BOT_TOKEN = '8803506830:AAFtJO4nJt4l5Cfzl_LHlQhAXIVsMorrN18';
const APP_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

// === ДЕФОЛТНЫЕ ТОВАРЫ (43 шт) ===
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: 'Burton Custom 2025',
        price: '54 990 ₽',
        images: [
            'https://images.unsplash.com/photo-1604915124551-0313421f71da?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1558604150-9989afc14a4c?w=600&h=400&fit=crop'
        ],
        desc: 'Легендарная модель для фрирайда и парка.',
        specs: [
            { name: 'Длина', value: '156 см' },
            { name: 'Жесткость', value: '7/10' },
            { name: 'Прогиб', value: 'Camber' },
            { name: 'Вес райдера', value: '60-85 кг' }
        ],
        category: 'Доски'
    },
    {
        id: 2,
        name: 'Jones Mountain Twin',
        price: '49 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1605087878415-00a4b0e7b5e2?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1604915124551-0313421f71da?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=400&fit=crop'
        ],
        desc: 'Универсальная доска для фрирайда.',
        specs: [
            { name: 'Длина', value: '158 см' },
            { name: 'Жесткость', value: '8/10' },
            { name: 'Прогиб', value: 'Camber/Flat' },
            { name: 'Вес райдера', value: '65-90 кг' }
        ],
        category: 'Доски'
    },
    {
        id: 3,
        name: 'Lib Tech T.Rice Pro',
        price: '59 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1605087878415-00a4b0e7b5e2?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1604915124551-0313421f71da?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональная доска для больших гор.',
        specs: [
            { name: 'Длина', value: '157 см' },
            { name: 'Жесткость', value: '9/10' },
            { name: 'Прогиб', value: 'C2' },
            { name: 'Вес райдера', value: '70-95 кг' }
        ],
        category: 'Доски'
    },
    {
        id: 4,
        name: 'Yes Standard',
        price: '44 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1558604150-9989afc14a4c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1604915124551-0313421f71da?w=600&h=400&fit=crop'
        ],
        desc: 'Новая модель с уникальной геометрией.',
        specs: [
            { name: 'Длина', value: '154 см' },
            { name: 'Жесткость', value: '6/10' },
            { name: 'Прогиб', value: 'Camber' },
            { name: 'Вес райдера', value: '55-80 кг' }
        ],
        category: 'Доски'
    },
    {
        id: 5,
        name: 'Salomon Assassin',
        price: '47 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1558604150-9989afc14a4c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1604915124551-0313421f71da?w=600&h=400&fit=crop'
        ],
        desc: 'Универсальная доска для парка и трасс.',
        specs: [
            { name: 'Длина', value: '155 см' },
            { name: 'Жесткость', value: '7/10' },
            { name: 'Прогиб', value: 'Quad Camber' },
            { name: 'Вес райдера', value: '60-85 кг' }
        ],
        category: 'Доски'
    },
    {
        id: 6,
        name: 'Ride Warpig',
        price: '52 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1574357336335-5b94f9e8b3e4?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1558604150-9989afc14a4c?w=600&h=400&fit=crop'
        ],
        desc: 'Короткая широкая доска для парка и фрирайда.',
        specs: [
            { name: 'Длина', value: '151 см' },
            { name: 'Жесткость', value: '8/10' },
            { name: 'Прогиб', value: 'Flat' },
            { name: 'Вес райдера', value: '65-90 кг' }
        ],
        category: 'Доски'
    },
    {
        id: 7,
        name: 'Adidas Tactical ADV',
        price: '19 990 ₽',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556906781-9a4129616c1c?w=600&h=400&fit=crop'
        ],
        desc: 'Ботинки с системой быстрой шнуровки.',
        specs: [
            { name: 'Размер', value: '42-46' },
            { name: 'Жесткость', value: '6/10' },
            { name: 'Вес', value: '1.8 кг' },
            { name: 'Шнуровка', value: 'Быстрая' }
        ],
        category: 'Ботинки'
    },
    {
        id: 8,
        name: 'Burton Ion 2025',
        price: '24 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональные ботинки с технологией Speed Zone.',
        specs: [
            { name: 'Размер', value: '40-47' },
            { name: 'Жесткость', value: '8/10' },
            { name: 'Вес', value: '2.0 кг' },
            { name: 'Шнуровка', value: 'Speed Zone' }
        ],
        category: 'Ботинки'
    },
    {
        id: 9,
        name: 'DC Judge BOA',
        price: '21 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop'
        ],
        desc: 'Ботинки с двойной системой BOA.',
        specs: [
            { name: 'Размер', value: '41-48' },
            { name: 'Жесткость', value: '9/10' },
            { name: 'Вес', value: '2.2 кг' },
            { name: 'Шнуровка', value: 'Dual BOA' }
        ],
        category: 'Ботинки'
    },
    {
        id: 10,
        name: 'Nike SB Zoom Ja',
        price: '17 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1556906781-9a4129616c1c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop'
        ],
        desc: 'Легкие и удобные ботинки от Nike.',
        specs: [
            { name: 'Размер', value: '40-45' },
            { name: 'Жесткость', value: '5/10' },
            { name: 'Вес', value: '1.6 кг' },
            { name: 'Шнуровка', value: 'Классическая' }
        ],
        category: 'Ботинки'
    },
    {
        id: 11,
        name: 'Vans Hi-Standard Pro',
        price: '18 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop'
        ],
        desc: 'Классические ботинки от Vans.',
        specs: [
            { name: 'Размер', value: '40-47' },
            { name: 'Жесткость', value: '6/10' },
            { name: 'Вес', value: '1.7 кг' },
            { name: 'Шнуровка', value: 'Классическая' }
        ],
        category: 'Ботинки'
    },
    {
        id: 12,
        name: 'Northwave Decade',
        price: '22 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональные ботинки для фрирайда.',
        specs: [
            { name: 'Размер', value: '41-47' },
            { name: 'Жесткость', value: '8/10' },
            { name: 'Вес', value: '2.1 кг' },
            { name: 'Шнуровка', value: 'Система SL' }
        ],
        category: 'Ботинки'
    },
    {
        id: 13,
        name: 'Oakley MOD1',
        price: '14 200 ₽',
        images: [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&h=400&fit=crop'
        ],
        desc: 'Легкий шлем с вентиляционной системой.',
        specs: [
            { name: 'Вес', value: '380 г' },
            { name: 'Размер', value: 'S-L' },
            { name: 'Сертификат', value: 'CE' },
            { name: 'Вентиляция', value: 'Регулируемая' }
        ],
        category: 'Шлемы'
    },
    {
        id: 14,
        name: 'Smith Holt',
        price: '11 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop'
        ],
        desc: 'Бюджетная модель шлема с отличной защитой.',
        specs: [
            { name: 'Вес', value: '350 г' },
            { name: 'Размер', value: 'M-L' },
            { name: 'Сертификат', value: 'EN 1077' },
            { name: 'Вентиляция', value: 'Фиксированная' }
        ],
        category: 'Шлемы'
    },
    {
        id: 15,
        name: 'POC Obex BC',
        price: '19 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональный шлем для бэккантри.',
        specs: [
            { name: 'Вес', value: '520 г' },
            { name: 'Размер', value: 'S-XL' },
            { name: 'Сертификат', value: 'EN 1077' },
            { name: 'RECCO', value: 'Да' }
        ],
        category: 'Шлемы'
    },
    {
        id: 16,
        name: 'Giro Ledge',
        price: '12 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&h=400&fit=crop'
        ],
        desc: 'Стильный и безопасный шлем для активного катания.',
        specs: [
            { name: 'Вес', value: '410 г' },
            { name: 'Размер', value: 'S-L' },
            { name: 'Сертификат', value: 'CE' },
            { name: 'Вентиляция', value: 'Регулируемая' }
        ],
        category: 'Шлемы'
    },
    {
        id: 17,
        name: 'Bern Watts',
        price: '13 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop'
        ],
        desc: 'Универсальный шлем для парка и улицы.',
        specs: [
            { name: 'Вес', value: '430 г' },
            { name: 'Размер', value: 'M-XL' },
            { name: 'Сертификат', value: 'EN 1077' },
            { name: 'Вентиляция', value: 'Активная' }
        ],
        category: 'Шлемы'
    },
    {
        id: 18,
        name: 'Sweet Protection Trooper 2Vi',
        price: '22 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop'
        ],
        desc: 'Топовая модель шлема для агрессивного катания.',
        specs: [
            { name: 'Вес', value: '550 г' },
            { name: 'Размер', value: 'S-XL' },
            { name: 'Сертификат', value: 'ASTM' },
            { name: 'Вентиляция', value: 'Регулируемая' }
        ],
        category: 'Шлемы'
    },
    {
        id: 19,
        name: 'Oakley Flight Deck L',
        price: '15 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1517879484726-e0f835e2f559?w=600&h=400&fit=crop'
        ],
        desc: 'Большая маска с широким обзором.',
        specs: [
            { name: 'Линза', value: 'Prizm' },
            { name: 'Обзор', value: 'Широкий' },
            { name: 'Покрытие', value: 'Антизапотевающее' },
            { name: 'Размер', value: 'L' }
        ],
        category: 'Маски'
    },
    {
        id: 20,
        name: 'Smith I/O MAG',
        price: '18 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1517879484726-e0f835e2f559?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональная маска с магнитной системой смены линз.',
        specs: [
            { name: 'Линза', value: 'ChromaPop' },
            { name: 'Смена линз', value: 'MAG' },
            { name: 'Покрытие', value: '5-слойное' },
            { name: 'Размер', value: 'M' }
        ],
        category: 'Маски'
    },
    {
        id: 21,
        name: 'Dragon X2s',
        price: '14 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1517879484726-e0f835e2f559?w=600&h=400&fit=crop'
        ],
        desc: 'Маска с футуристическим дизайном.',
        specs: [
            { name: 'Линза', value: 'Lumalens' },
            { name: 'Смена линз', value: 'Swiftlock' },
            { name: 'UV защита', value: '100%' },
            { name: 'Размер', value: 'L' }
        ],
        category: 'Маски'
    },
    {
        id: 22,
        name: 'Anon M4',
        price: '16 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1517879484726-e0f835e2f559?w=600&h=400&fit=crop'
        ],
        desc: 'Инновационная маска с периферийным обзором.',
        specs: [
            { name: 'Линза', value: 'Cylindrical' },
            { name: 'Смена линз', value: 'MFI' },
            { name: 'Покрытие', value: 'Антизапотевающее' },
            { name: 'Размер', value: 'M' }
        ],
        category: 'Маски'
    },
    {
        id: 23,
        name: 'Giro Contact',
        price: '12 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1517879484726-e0f835e2f559?w=600&h=400&fit=crop'
        ],
        desc: 'Универсальная маска с увеличенным обзором.',
        specs: [
            { name: 'Линза', value: 'VIVID' },
            { name: 'Обзор', value: 'Увеличенный' },
            { name: 'UV защита', value: '100%' },
            { name: 'Размер', value: 'L' }
        ],
        category: 'Маски'
    },
    {
        id: 24,
        name: 'Electric EGX',
        price: '13 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1517879484726-e0f835e2f559?w=600&h=400&fit=crop'
        ],
        desc: 'Стильная маска с отличной защитой от солнца.',
        specs: [
            { name: 'Линза', value: 'Plano' },
            { name: 'Смена линз', value: 'Quick Change' },
            { name: 'UV защита', value: '100%' },
            { name: 'Размер', value: 'M' }
        ],
        category: 'Маски'
    },
    {
        id: 25,
        name: 'Dakine Low Rider',
        price: '8 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Универсальный чехол для сноуборда.',
        specs: [
            { name: 'Длина', value: '156 см' },
            { name: 'Материал', value: 'Polyester' },
            { name: 'Карманы', value: '2' },
            { name: 'Вес', value: '0.8 кг' }
        ],
        category: 'Чехлы'
    },
    {
        id: 26,
        name: 'Burton Wheelie Gig',
        price: '12 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Чехол с колесами для легкой транспортировки.',
        specs: [
            { name: 'Длина', value: '160 см' },
            { name: 'Материал', value: 'Нейлон' },
            { name: 'Колеса', value: 'Да' },
            { name: 'Карманы', value: '3' }
        ],
        category: 'Чехлы'
    },
    {
        id: 27,
        name: 'Jones Snowboard Bag',
        price: '10 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Легкий чехол для сноуборда.',
        specs: [
            { name: 'Длина', value: '165 см' },
            { name: 'Материал', value: 'Polyester' },
            { name: 'Водоотталкивание', value: 'Да' },
            { name: 'Вес', value: '0.9 кг' }
        ],
        category: 'Чехлы'
    },
    {
        id: 28,
        name: 'Ride Protective Sleeve',
        price: '6 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Простой и удобный чехол-рукав.',
        specs: [
            { name: 'Длина', value: '158 см' },
            { name: 'Материал', value: 'Неопрен' },
            { name: 'Вес', value: '0.5 кг' },
            { name: 'Складной', value: 'Да' }
        ],
        category: 'Чехлы'
    },
    {
        id: 29,
        name: 'Salomon Board Bag',
        price: '9 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Универсальный чехол для доски и креплений.',
        specs: [
            { name: 'Длина', value: '162 см' },
            { name: 'Материал', value: 'Polyester' },
            { name: 'Отделения', value: '2' },
            { name: 'Вес', value: '1.2 кг' }
        ],
        category: 'Чехлы'
    },
    {
        id: 30,
        name: 'K2 Travel Cover',
        price: '7 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Компактный чехол для путешествий.',
        specs: [
            { name: 'Длина', value: '155 см' },
            { name: 'Материал', value: 'Нейлон' },
            { name: 'Вес', value: '0.7 кг' },
            { name: 'Складной', value: 'Да' }
        ],
        category: 'Чехлы'
    },
    {
        id: 31,
        name: 'Union Force',
        price: '24 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Надежные крепления для любого стиля катания.',
        specs: [
            { name: 'Вес', value: '1.2 кг' },
            { name: 'Материал', value: 'Алюминий' },
            { name: 'Размер', value: 'S/M' },
            { name: 'Жесткость', value: '7/10' }
        ],
        category: 'Крепления'
    },
    {
        id: 32,
        name: 'Burton Genesis',
        price: '26 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Крепления с высокой поддержкой.',
        specs: [
            { name: 'Вес', value: '1.4 кг' },
            { name: 'Материал', value: 'Композит' },
            { name: 'Размер', value: 'L' },
            { name: 'Жесткость', value: '8/10' }
        ],
        category: 'Крепления'
    },
    {
        id: 33,
        name: 'K2 Indy',
        price: '19 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Бюджетные крепления для парка и трасс.',
        specs: [
            { name: 'Вес', value: '1.0 кг' },
            { name: 'Материал', value: 'Алюминий' },
            { name: 'Размер', value: 'M' },
            { name: 'Жесткость', value: '6/10' }
        ],
        category: 'Крепления'
    },
    {
        id: 34,
        name: 'Ride A-10',
        price: '22 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Крепления с высокой жесткостью.',
        specs: [
            { name: 'Вес', value: '1.3 кг' },
            { name: 'Материал', value: 'Алюминий' },
            { name: 'Размер', value: 'L' },
            { name: 'Жесткость', value: '9/10' }
        ],
        category: 'Крепления'
    },
    {
        id: 35,
        name: 'Salomon Hologram',
        price: '21 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Инновационные крепления с технологией Shadow Fit.',
        specs: [
            { name: 'Вес', value: '1.1 кг' },
            { name: 'Материал', value: 'Композит' },
            { name: 'Размер', value: 'M/L' },
            { name: 'Жесткость', value: '7/10' }
        ],
        category: 'Крепления'
    },
    {
        id: 36,
        name: 'Drake Fifty',
        price: '18 900 ₽',
        images: [
            'https://images.unsplash.com/photo-1560490441-7910b4830b6a?w=600&h=400&fit=crop'
        ],
        desc: 'Надежные крепления для фрирайда и парка.',
        specs: [
            { name: 'Вес', value: '1.0 кг' },
            { name: 'Материал', value: 'Алюминий' },
            { name: 'Размер', value: 'M' },
            { name: 'Жесткость', value: '6/10' }
        ],
        category: 'Крепления'
    },
    {
        id: 37,
        name: 'Заточка кантов',
        price: '2 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональная заточка кантов сноуборда.',
        specs: [
            { name: 'Время', value: '30 мин' },
            { name: 'Сложность', value: 'Средняя' },
            { name: 'Гарантия', value: '1 месяц' },
            { name: 'Скидка', value: '10% при повторном обращении' }
        ],
        category: 'Сервис'
    },
    {
        id: 38,
        name: 'Смазка скользяка',
        price: '3 000 ₽',
        images: [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональная смазка скользящей поверхности.',
        specs: [
            { name: 'Время', value: '45 мин' },
            { name: 'Температура', value: 'От -30° до +5°' },
            { name: 'Гарантия', value: '2 месяца' },
            { name: 'Скидка', value: '15% при комплексном обслуживании' }
        ],
        category: 'Сервис'
    },
    {
        id: 39,
        name: 'Ремонт скользяка',
        price: '4 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
        ],
        desc: 'Ремонт повреждений скользящей поверхности.',
        specs: [
            { name: 'Время', value: '2 часа' },
            { name: 'Сложность', value: 'Высокая' },
            { name: 'Гарантия', value: '3 месяца' },
            { name: 'Материалы', value: 'Включены в стоимость' }
        ],
        category: 'Сервис'
    },
    {
        id: 40,
        name: 'Установка креплений',
        price: '2 000 ₽',
        images: [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
        ],
        desc: 'Профессиональная установка и настройка креплений.',
        specs: [
            { name: 'Время', value: '20 мин' },
            { name: 'Сложность', value: 'Низкая' },
            { name: 'Гарантия', value: '1 месяц' },
            { name: 'Бесплатно', value: 'При покупке креплений' }
        ],
        category: 'Сервис'
    },
    {
        id: 41,
        name: 'Комплексное ТО',
        price: '8 000 ₽',
        images: [
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
        ],
        desc: 'Полное техническое обслуживание сноуборда.',
        specs: [
            { name: 'Время', value: '3 часа' },
            { name: 'Сложность', value: 'Высокая' },
            { name: 'Гарантия', value: '6 месяцев' },
            { name: 'Экономия', value: '30% против отдельных услуг' }
        ],
        category: 'Сервис'
    },
    {
        id: 42,
        name: 'Диагностика доски',
        price: '1 500 ₽',
        images: [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
        ],
        desc: 'Полная диагностика состояния сноуборда.',
        specs: [
            { name: 'Время', value: '15 мин' },
            { name: 'Сложность', value: 'Низкая' },
            { name: 'Гарантия', value: 'Нет' },
            { name: 'Бесплатно', value: 'При заказе любого ремонта' }
        ],
        category: 'Сервис'
    },
    {
        id: 43,
        name: '📞 Контакты',
        price: '',
        images: [],
        desc: 'Свяжитесь с нами любым удобным способом!',
        specs: [
            { name: 'Телефон', value: '+7 (999) 123-45-67' },
            { name: 'Адрес', value: 'г. Москва, ул. Сноубордная, д. 15' },
            { name: 'Режим работы', value: 'Пн-Вс: 9:00 - 19:00' },
            { name: 'Email', value: 'info@snowboard-store.ru' }
        ],
        category: 'Контакты',
        isContact: true
    }
];

// === ОСНОВНОЙ ОБРАБОТЧИК ===
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // === API: Получить все товары ===
        if (path === '/api/products') {
            try {
                let products = await env.KV.get('products', 'json');
                
                if (!products || products.length === 0) {
                    await env.KV.put('products', JSON.stringify(DEFAULT_PRODUCTS));
                    products = DEFAULT_PRODUCTS;
                }
                
                return new Response(JSON.stringify(products), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'no-cache'
                    }
                });
            } catch (e) {
                console.error('Ошибка:', e);
                return new Response(JSON.stringify({ error: 'Ошибка загрузки' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // === API: Сохранить товары ===
        if (path === '/api/products' && request.method === 'POST') {
            try {
                const products = await request.json();
                await env.KV.put('products', JSON.stringify(products));
                
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            } catch (e) {
                console.error('Ошибка сохранения:', e);
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // === API: Получить оповещение ===
        if (path === '/api/announcement') {
            try {
                const announcement = await env.KV.get('announcement', 'json');
                if (!announcement) {
                    return new Response(JSON.stringify({ text: null }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                const now = new Date().getTime();
                if (announcement.expires && now < announcement.expires) {
                    return new Response(JSON.stringify({ text: announcement.text }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                } else {
                    await env.KV.delete('announcement');
                    return new Response(JSON.stringify({ text: null }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            } catch (e) {
                return new Response(JSON.stringify({ text: null }), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        }

        // === API: Сохранить оповещение ===
        if (path === '/api/announcement' && request.method === 'POST') {
            try {
                const data = await request.json();
                if (data.text && data.text.trim() !== '') {
                    const expires = new Date().getTime() + (24 * 60 * 60 * 1000);
                    await env.KV.put('announcement', JSON.stringify({
                        text: data.text.trim(),
                        expires: expires
                    }));
                } else {
                    await env.KV.delete('announcement');
                }
                
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: 'Ошибка сохранения' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // === Telegram Webhook ===
        if (path === '/webhook') {
            try {
                const body = await request.json();
                await handleTelegramMessage(body, env);
                return new Response('OK', { status: 200 });
            } catch (e) {
                console.error('Webhook error:', e);
                return new Response('Error', { status: 500 });
            }
        }

        // === Статические файлы ===
        return new Response('Not found', { status: 404 });
    }
};

// === ОБРАБОТКА TELEGRAM СООБЩЕНИЙ ===
async function handleTelegramMessage(message, env) {
    const chatId = message.message?.chat?.id;
    const text = message.message?.text;
    const callback = message.callback_query;
    
    if (!chatId) return;
    
    if (callback) {
        await handleCallback(callback, env);
        return;
    }
    
    if (!text) return;
    
    let replyText = '';
    let buttons = [];
    
    switch (text) {
        case '/start':
            replyText = `🏔️ Добро пожаловать в Snowboard Store!\n\n❄️ Твой гид в мире сноубординга!\n\nЗдесь ты найдешь:\n🏂 Сноуборды\n👢 Ботинки\n⛑️ Шлемы\n🎭 Маски\n🔧 Сервис\n📞 Контакты\n\n🔥 Начни свое приключение уже сегодня!`;
            buttons = [
                [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
                [{ text: '📢 Оповещения', callback_data: 'check_announcement' }],
                [{ text: '📞 Контакты', callback_data: 'contacts' }]
            ];
            break;
            
        case '/help':
            replyText = `❓ Помощь — Snowboard Store\n\n📌 Основные разделы:\n🛒 /catalog - Каталог\n🔧 /services - Услуги\n📞 /contacts - Контакты\n\n❄️ Удачи на склонах!`;
            buttons = [
                [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
                [{ text: '🏔️ Главное меню', callback_data: 'start' }]
            ];
            break;
            
        case '/catalog':
            replyText = `🛒 Каталог товаров\n\n🏂 Сноуборды\n👢 Ботинки\n⛑️ Шлемы\n🎭 Маски\n🎒 Чехлы\n🔗 Крепления\n🔧 Сервис\n📞 Контакты\n\n👇 Нажми на кнопку ниже!`;
            buttons = [
                [{ text: '🛒 Смотреть каталог', web_app: { url: APP_URL } }]
            ];
            break;
            
        case '/contacts':
            replyText = `📞 Контакты\n\n📍 Адрес: г. Москва, ул. Сноубордная, д. 15\n📱 Телефон: +7 (999) 123-45-67\n📧 Email: info@snowboard-store.ru\n🕐 Режим работы: Пн-Вс: 9:00 - 19:00`;
            buttons = [
                [{ text: '📞 Позвонить', url: 'tel:+79991234567' }],
                [{ text: '📍 Показать на карте', url: 'https://maps.google.com/?q=Москва+ул+Сноубордная+15' }],
                [{ text: '🏔️ Главное меню', callback_data: 'start' }]
            ];
            break;
            
        default:
            replyText = `🤔 Я не понял запрос.\n\nДоступные команды:\n/start — Главное меню\n/catalog — Каталог\n/services — Услуги\n/contacts — Контакты\n/help — Помощь`;
            buttons = [
                [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
                [{ text: '🏔️ Главное меню', callback_data: 'start' }]
            ];
    }
    
    await sendTelegramMessage(chatId, replyText, buttons);
}

async function handleCallback(callback, env) {
    const chatId = callback.message?.chat?.id;
    const data = callback.data;
    
    if (!chatId) return;
    
    let replyText = '';
    let buttons = [];
    
    switch (data) {
        case 'start':
            replyText = `🏔️ Добро пожаловать в Snowboard Store!\n\n❄️ Твой гид в мире сноубординга!\n\n🔥 Начни свое приключение уже сегодня!`;
            buttons = [
                [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
                [{ text: '📢 Оповещения', callback_data: 'check_announcement' }],
                [{ text: '📞 Контакты', callback_data: 'contacts' }]
            ];
            break;
            
        case 'check_announcement':
            try {
                const announcement = await env.KV.get('announcement', 'json');
                if (announcement && announcement.text) {
                    const now = new Date().getTime();
                    if (announcement.expires && now < announcement.expires) {
                        replyText = `📢 Оповещение:\n\n${announcement.text}`;
                    } else {
                        await env.KV.delete('announcement');
                        replyText = '📢 Активных оповещений нет. 🏔️';
                    }
                } else {
                    replyText = '📢 Активных оповещений нет. 🏔️';
                }
            } catch (e) {
                replyText = '📢 Активных оповещений нет. 🏔️';
            }
            buttons = [
                [{ text: '🏔️ Главное меню', callback_data: 'start' }]
            ];
            break;
            
        case 'contacts':
            replyText = `📞 Контакты\n\n📍 г. Москва, ул. Сноубордная, д. 15\n📱 +7 (999) 123-45-67\n📧 info@snowboard-store.ru\n🕐 Пн-Вс: 9:00 - 19:00`;
            buttons = [
                [{ text: '📞 Позвонить', url: 'tel:+79991234567' }],
                [{ text: '📍 На карте', url: 'https://maps.google.com/?q=Москва+ул+Сноубордная+15' }],
                [{ text: '🏔️ Назад', callback_data: 'start' }]
            ];
            break;
    }
    
    await sendTelegramMessage(chatId, replyText, buttons);
}

async function sendTelegramMessage(chatId, text, buttons = []) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    };
    
    if (buttons.length > 0) {
        payload.reply_markup = {
            inline_keyboard: buttons
        };
    }
    
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}
