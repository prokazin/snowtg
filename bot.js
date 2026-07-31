const { Telegraf } = require('telegraf');

const BOT_TOKEN = '8803506830:AAFtJO4nJt4l5Cfzl_LHlQhAXIVsMorrN18';
const WEBAPP_URL = 'https://your-github-username.github.io/snowshop/'; // ЗАМЕНИТЕ НА ВАШУ ССЫЛКУ

const bot = new Telegraf(BOT_TOKEN);

// Команда /start
bot.start((ctx) => {
    const welcomeMessage = `🏔️ Добро пожаловать в SnowShop!
    
❄️ Здесь вы найдете:
• Сноуборды, крепления, ботинки, шлемы
• Профессиональные услуги сервиса
• Актуальные цены и описания

Нажмите кнопку ниже, чтобы открыть витрину!`;

    ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ 
                    text: '🏂 Открыть витрину', 
                    web_app: { url: WEBAPP_URL } 
                }],
                [{ 
                    text: '🔧 Наш сервис', 
                    web_app: { url: WEBAPP_URL } 
                }]
            ],
            resize_keyboard: true
        }
    });
});

// Команда /help
bot.help((ctx) => {
    ctx.reply('❄️ SnowShop Bot\n\nДоступные команды:\n/start - Главное меню\n/help - Помощь\n/shop - Открыть витрину');
});

// Команда /shop
bot.command('shop', (ctx) => {
    ctx.reply('Открываю витрину...', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🛒 Перейти в магазин', web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
});

// Обработка callback-запросов (если нужны)
bot.action('open_shop', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('Открываю магазин...', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🛒 Открыть витрину', web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
});

// Запуск бота
bot.launch()
    .then(() => {
        console.log('✅ Бот SnowShop успешно запущен!');
        console.log(`📱 Откройте бота: https://t.me/${bot.botInfo.username}`);
    })
    .catch((err) => {
        console.error('❌ Ошибка запуска бота:', err);
    });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
