// === КАТЕГОРИИ (ТОЛЬКО ЧЕРЕЗ КОД) ===
const categories = [
    { name: 'Доски', icon: 'Доски.png' },
    { name: 'Ботинки', icon: 'Ботинки.png' },
    { name: 'Шлемы', icon: 'Шлем.png' },
    { name: 'Маски', icon: 'Маски.png' },
    { name: 'Чехлы', icon: 'Чехлы.png' },
    { name: 'Крепления', icon: 'Крепления.png' }
];

// Сохраняем категории в localStorage при загрузке
localStorage.setItem('snowboard_categories', JSON.stringify(categories));

let currentTab = categories[0].name;

// === ВСЕ ТОВАРЫ (36 шт) ===
const defaultProducts = [
    // === ДОСКИ (6 шт) ===
    {
        id: 1,
        name: 'Burton Custom 2025',
        price: '54 990 ₽',
        image: 'https://placehold.co/600x400/ffffff/1a3a4a?text=Burton+Custom+2025',
        desc: 'Легендарная модель для фрирайда и парка. Идеально подходит для катания по целине и в парке. Универсальная геометрия позволяет уверенно чувствовать себя на любом склоне. Сердечник из дерева с карбоновыми вставками обеспечивает отличную упругость и контроль.',
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
        image: 'https://placehold.co/600x400/ffffff/2a4a5a?text=Jones+Mountain+Twin',
        desc: 'Универсальная доска для фрирайда. Отлично держит дугу на жестком склоне и легко плывет по пухляку. Симметричная геометрия для катания в обе стороны. Сердечник из бамбука и тополя.',
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
        image: 'https://placehold.co/600x400/ffffff/3a5a6a?text=Lib+Tech+T.Rice+Pro',
        desc: 'Профессиональная доска для больших гор. Разработана совместно с Трэвисом Райсом. Магни-тракшн технология для лучшего сцепления на льду. Легкая и прочная конструкция.',
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
        image: 'https://placehold.co/600x400/ffffff/4a6a7a?text=Yes+Standard',
        desc: 'Новая модель с уникальной геометрией. Подходит для любого стиля катания. Технология UnderBite позволяет легко кантовать и дает отличное сцепление. Сердечник из осины.',
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
        image: 'https://placehold.co/600x400/ffffff/5a7a8a?text=Salomon+Assassin',
        desc: 'Универсальная доска для парка и трасс. Идеальный баланс между попом и стабильностью. Квадро-камель профиль дает уверенность на любом покрытии. Отличная доска для прогресса.',
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
        image: 'https://placehold.co/600x400/ffffff/6a8a9a?text=Ride+Warpig',
        desc: 'Короткая широкая доска для парка и фрирайда. Отличная плавучесть в пухляке и стабильность на жестком склоне. Необычная геометрия для максимального удовольствия от катания.',
        specs: [
            { name: 'Длина', value: '151 см' },
            { name: 'Жесткость', value: '8/10' },
            { name: 'Прогиб', value: 'Flat' },
            { name: 'Вес райдера', value: '65-90 кг' }
        ],
        category: 'Доски'
    },
    
    // === БОТИНКИ (6 шт) ===
    {
        id: 7,
        name: 'Adidas Tactical ADV',
        price: '19 990 ₽',
        image: 'https://placehold.co/600x400/ffffff/3a5a6a?text=Adidas+Tactical+ADV',
        desc: 'Ботинки с системой быстрой шнуровки и анатомической стелькой. Превосходная поддержка голеностопа и комфорт в течение всего дня катания. Внешняя оболочка из прочного материала защищает от влаги.',
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
        image: 'https://placehold.co/600x400/ffffff/4a5a6a?text=Burton+Ion+2025',
        desc: 'Профессиональные ботинки с технологией Speed Zone. Идеальная поддержка и комфорт. Система регулировки наклона позволяет настроить посадку под любой стиль катания.',
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
        image: 'https://placehold.co/600x400/ffffff/5a6a7a?text=DC+Judge+BOA',
        desc: 'Ботинки с двойной системой BOA для идеальной фиксации. Анатомическая подошва с амортизацией. Отличный выбор для агрессивного катания и фрирайда.',
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
        image: 'https://placehold.co/600x400/ffffff/6a7a8a?text=Nike+SB+Zoom+Ja',
        desc: 'Легкие и удобные ботинки от Nike. Технология Zoom Air для амортизации. Дышащий материал и быстрая шнуровка. Идеальный вариант для парка.',
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
        image: 'https://placehold.co/600x400/ffffff/7a8a9a?text=Vans+Hi-Standard+Pro',
        desc: 'Классические ботинки от Vans. Отличная подошва с амортизацией и комфортная внутренняя стелька. Стильный дизайн и надежная конструкция для любого стиля катания.',
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
        image: 'https://placehold.co/600x400/ffffff/8a9aaa?text=Northwave+Decade',
        desc: 'Профессиональные ботинки для фрирайда. Технология Power Frame обеспечивает отличную передачу усилий. Удобная колодка и качественные материалы для долгой службы.',
        specs: [
            { name: 'Размер', value: '41-47' },
            { name: 'Жесткость', value: '8/10' },
            { name: 'Вес', value: '2.1 кг' },
            { name: 'Шнуровка', value: 'Система SL' }
        ],
        category: 'Ботинки'
    },
    
    // === ШЛЕМЫ (6 шт) ===
    {
        id: 13,
        name: 'Oakley MOD1',
        price: '14 200 ₽',
        image: 'https://placehold.co/600x400/ffffff/4a6a7a?text=Oakley+MOD1',
        desc: 'Легкий шлем с вентиляционной системой и защитой от ударов. Интегрированная система регулировки размера. Внутренняя подкладка из гипоаллергенных материалов отводит влагу.',
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
        image: 'https://placehold.co/600x400/ffffff/5a7a8a?text=Smith+Holt',
        desc: 'Бюджетная модель шлема с отличной защитой. Система регулировки размера SnapFit. Внутренняя подкладка из мягкого материала для комфорта.',
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
        image: 'https://placehold.co/600x400/ffffff/6a8a9a?text=POC+Obex+BC',
        desc: 'Профессиональный шлем для бэккантри. Защита от боковых и задних ударов. Технология RECCO для поиска в лавинах. Легкая и прочная конструкция.',
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
        image: 'https://placehold.co/600x400/ffffff/7a8a9a?text=Giro+Ledge',
        desc: 'Стильный и безопасный шлем для активного катания. Система регулировки In Form 2. Отличная вентиляция и комфортная посадка. Идеально подходит для фрирайда.',
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
        image: 'https://placehold.co/600x400/ffffff/8a9aaa?text=Bern+Watts',
        desc: 'Универсальный шлем для парка и улицы. Защита от боковых ударов. Внутренняя подкладка с технологией Zip Mold для комфортной посадки.',
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
        image: 'https://placehold.co/600x400/ffffff/9aaaab?text=Sweet+Protection+Trooper',
        desc: 'Топовая модель шлема для агрессивного катания. Технология 2Vi для максимальной защиты. Высококачественные материалы и отличная вентиляция для комфорта.',
        specs: [
            { name: 'Вес', value: '550 г' },
            { name: 'Размер', value: 'S-XL' },
            { name: 'Сертификат', value: 'ASTM' },
            { name: 'Вентиляция', value: 'Регулируемая' }
        ],
        category: 'Шлемы'
    },
    
    // === МАСКИ (6 шт) ===
    {
        id: 19,
        name: 'Oakley Flight Deck L',
        price: '15 900 ₽',
        image: 'https://placehold.co/600x400/ffffff/4a6a7a?text=Oakley+Flight+Deck',
        desc: 'Большая маска с широким обзором. Технология Prizm для четкости изображения. Тройной слой пены для комфорта и антизапотевающее покрытие.',
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
        image: 'https://placehold.co/600x400/ffffff/5a7a8a?text=Smith+I%2FO+MAG',
        desc: 'Профессиональная маска с магнитной системой смены линз. Технология ChromaPop для ярких цветов. Двойная пена для максимального комфорта.',
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
        image: 'https://placehold.co/600x400/ffffff/6a8a9a?text=Dragon+X2s',
        desc: 'Маска с футуристическим дизайном. Технология Lumalens для четкости. Система быстрой смены линз Swiftlock. Отличная защита от UV-лучей.',
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
        image: 'https://placehold.co/600x400/ffffff/7a8a9a?text=Anon+M4',
        desc: 'Инновационная маска с периферийным обзором. Технология Cylindrical для минимального искажения. Магнитная система смены линз MFI.',
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
        image: 'https://placehold.co/600x400/ffffff/8a9aaa?text=Giro+Contact',
        desc: 'Универсальная маска с увеличенным обзором. Технология VIVID для четкости в любую погоду. Отличная вентиляция и комфортная посадка.',
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
        image: 'https://placehold.co/600x400/ffffff/9aaaab?text=Electric+EGX',
        desc: 'Стильная маска с отличной защитой от солнца. Технология Plano для четкости. Система Quick Change для быстрой смены линз.',
        specs: [
            { name: 'Линза', value: 'Plano' },
            { name: 'Смена линз', value: 'Quick Change' },
            { name: 'UV защита', value: '100%' },
            { name: 'Размер', value: 'M' }
        ],
        category: 'Маски'
    },
    
    // === ЧЕХЛЫ (6 шт) ===
    {
        id: 25,
        name: 'Dakine Low Rider',
        price: '8 900 ₽',
        image: 'https://placehold.co/600x400/ffffff/4a5a6a?text=Dakine+Low+Rider',
        desc: 'Универсальный чехол для сноуборда. Защищает доску при транспортировке. Имеет дополнительные карманы для креплений и инструментов.',
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
        image: 'https://placehold.co/600x400/ffffff/5a6a7a?text=Burton+Wheelie+Gig',
        desc: 'Чехол с колесами для легкой транспортировки. Жесткая конструкция для защиты от ударов. Удобные ручки и дополнительные карманы для снаряжения.',
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
        image: 'https://placehold.co/600x400/ffffff/6a7a8a?text=Jones+Snowboard+Bag',
        desc: 'Легкий чехол для сноуборда. Используется при транспортировке и хранении. Защищает от царапин и пыли. Водоотталкивающая пропитка.',
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
        image: 'https://placehold.co/600x400/ffffff/7a8a9a?text=Ride+Protective+Sleeve',
        desc: 'Простой и удобный чехол-рукав для ежедневного использования. Защищает доску от царапин. Легко складывается и занимает минимум места.',
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
        image: 'https://placehold.co/600x400/ffffff/8a9aaa?text=Salomon+Board+Bag',
        desc: 'Универсальный чехол для доски и креплений. Имеет отдельные отделения для снаряжения. Жесткая конструкция для защиты при транспортировке.',
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
        image: 'https://placehold.co/600x400/ffffff/9aaaab?text=K2+Travel+Cover',
        desc: 'Компактный чехол для путешествий. Защищает доску от пыли и царапин. Легкий и прочный материал. Идеален для полетов и поездок.',
        specs: [
            { name: 'Длина', value: '155 см' },
            { name: 'Материал', value: 'Нейлон' },
            { name: 'Вес', value: '0.7 кг' },
            { name: 'Складной', value: 'Да' }
        ],
        category: 'Чехлы'
    },
    
    // === КРЕПЛЕНИЯ (6 шт) ===
    {
        id: 31,
        name: 'Union Force',
        price: '24 500 ₽',
        image: 'https://placehold.co/600x400/ffffff/2a4a5a?text=Union+Force',
        desc: 'Надежные крепления для любого стиля катания. Алюминиевая база с высоким качеством обработки. Быстрая регулировка под любой размер ботинка. Отличная передача усилий на кант.',
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
        image: 'https://placehold.co/600x400/ffffff/3a5a6a?text=Burton+Genesis',
        desc: 'Крепления с высокой поддержкой. Технология AutoCAN для быстрой настройки. Удобный дизайн и отличная амортизация. Идеальны для фрирайда.',
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
        image: 'https://placehold.co/600x400/ffffff/4a6a7a?text=K2+Indy',
        desc: 'Бюджетные крепления для парка и трасс. Прочная конструкция и быстрая регулировка. Отличное соотношение цены и качества.',
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
        image: 'https://placehold.co/600x400/ffffff/5a7a8a?text=Ride+A-10',
        desc: 'Крепления с высокой жесткостью для агрессивного катания. Технология Series 4 для максимальной передачи усилий. Отличная поддержка ноги.',
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
        image: 'https://placehold.co/600x400/ffffff/6a8a9a?text=Salomon+Hologram',
        desc: 'Инновационные крепления с технологией Shadow Fit. Автоматическая подстройка под стиль катания. Легкие и прочные.',
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
        image: 'https://placehold.co/600x400/ffffff/7a8a9a?text=Drake+Fifty',
        desc: 'Надежные крепления для фрирайда и парка. Алюминиевая конструкция с быстрой регулировкой. Отличная передача усилий на кант.',
        specs: [
            { name: 'Вес', value: '1.0 кг' },
            { name: 'Материал', value: 'Алюминий' },
            { name: 'Размер', value: 'M' },
            { name: 'Жесткость', value: '6/10' }
        ],
        category: 'Крепления'
    }
];

// === ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ДАННЫХ ===
function loadProducts() {
    let storedProducts = JSON.parse(localStorage.getItem('snowboard_products'));
    
    // Если в localStorage нет данных или там меньше товаров, чем должно быть
    if (!storedProducts || storedProducts.length < defaultProducts.length) {
        // Сохраняем все дефолтные товары
        localStorage.setItem('snowboard_products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    
    // Проверяем, все ли товары есть
    const storedIds = storedProducts.map(p => p.id);
    const missingProducts = defaultProducts.filter(p => !storedIds.includes(p.id));
    
    if (missingProducts.length > 0) {
        // Добавляем недостающие товары
        storedProducts = [...storedProducts, ...missingProducts];
        localStorage.setItem('snowboard_products', JSON.stringify(storedProducts));
    }
    
    return storedProducts;
}

// Загружаем товары
let products = loadProducts();

// === РЕНДЕР КАТАЛОГА ===
function renderCatalog(category) {
    const container = document.getElementById('catalog');
    const filtered = products.filter(p => p.category === category);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-message">Нет товаров в этой категории</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/ffffff/cccccc?text=No+Image'" />
            <h3>${p.name}</h3>
            <div class="price">${p.price}</div>
            <div class="desc-preview">${p.desc}</div>
            <div class="specs">
                ${p.specs.slice(0, 2).map(s => `<span>${s.name}: ${s.value}</span>`).join('')}
            </div>
            <div class="read-more">Читать полностью →</div>
        </div>
    `).join('');
}

// === РЕНДЕР НАВИГАЦИИ ===
function renderNav() {
    const nav = document.getElementById('bottom-nav');
    if (!categories || categories.length === 0) {
        nav.innerHTML = '<span style="color:#8e8e93; padding:8px; font-size:14px;">Нет категорий</span>';
        return;
    }

    nav.innerHTML = categories.map(cat => `
        <button class="nav-btn ${currentTab === cat.name ? 'active' : ''}" data-tab="${cat.name}">
            <img src="${cat.icon}" alt="${cat.name}" onerror="this.src='https://placehold.co/32/cccccc/aaaaaa?text=?'" />
        </button>
    `).join('');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.dataset.tab;
            renderCatalog(currentTab);
        });
    });
}

// === МОДАЛЬНОЕ ОКНО ===
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x400/ffffff/cccccc?text=No+Image'" />
        <h2>${product.name}</h2>
        <div class="modal-price">${product.price}</div>
        <div class="modal-desc">${product.desc}</div>
        <div class="modal-specs">
            ${product.specs.map(s => `<div class="spec-item"><span class="spec-name">${s.name}</span><span class="spec-value">${s.value}</span></div>`).join('')}
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

// === ЗАКРЫТИЕ МОДАЛКИ ===
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
});

// === ЗАГРУЗОЧНЫЙ ЭКРАН ===
function updateCountdown() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 1);
    if (now > target) target.setFullYear(target.getFullYear() + 1);
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    const msg = document.getElementById('splash-message');
    if (msg) {
        if (days < 30) msg.textContent = '❄️ Сезон уже близко!';
        else if (days < 60) msg.textContent = '⛷️ Готовь снаряжение!';
        else msg.textContent = '🏔️ До первого снега осталось...';
    }
}

function shouldHideSplash() {
    const now = new Date();
    return now.getMonth() === 11 && now.getDate() === 1;
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');
    const closeBtn = document.getElementById('close-splash');

    // Проверяем, нужно ли скрыть сплеш (1 декабря)
    if (shouldHideSplash()) {
        if (splash) splash.style.display = 'none';
        if (app) {
            app.style.display = 'flex';
            setTimeout(() => {
                app.classList.add('visible');
            }, 50);
            renderNav();
            if (currentTab) renderCatalog(currentTab);
        }
        return;
    }

    // Запускаем таймер обратного отсчета
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Автоматическое закрытие через 5 секунд
    let splashTimer = setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
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
        clearInterval(countdownInterval);
    }, 5000);

    // Закрытие по кнопке
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            clearTimeout(splashTimer);
            clearInterval(countdownInterval);
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
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
        });
    }
});

// === ОБНОВЛЕНИЕ ДАННЫХ ИЗ LOCALSTORAGE ===
window.refreshCatalog = function() {
    products = JSON.parse(localStorage.getItem('snowboard_products')) || products;
    renderNav();
    if (currentTab) renderCatalog(currentTab);
};

// === ЗАЩИТА ОТ ЗУМА ===
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
