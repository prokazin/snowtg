import { Telegraf } from 'telegraf';

const BOT_TOKEN = '8803506830:AAFtJO4nJt4l5Cfzl_LHlQhAXIVsMorrN18';
const WEBAPP_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

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
                }],
                [{ 
                    text: '⚙️ Админ-панель', 
                    web_app: { url: `${WEBAPP_URL}admin.html` } 
                }]
            ]
        }
    });
});

// Команда /help
bot.help((ctx) => {
    ctx.reply('❄️ SnowShop Bot\n\nДоступные команды:\n/start - Главное меню\n/help - Помощь\n/shop - Открыть витрину\n/admin - Открыть админ-панель');
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

// Команда /admin
bot.command('admin', (ctx) => {
    const adminIds = [123456789]; // Замените на ваш ID
    if (adminIds.includes(ctx.from.id)) {
        ctx.reply('🔐 Открываю админ-панель...', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⚙️ Перейти в админку', web_app: { url: `${WEBAPP_URL}admin.html` } }]
                ]
            }
        });
    } else {
        ctx.reply('⛔ Доступ запрещен');
    }
});

// Для Cloudflare Workers
export default {
    async fetch(request, env) {
        try {
            // Устанавливаем webhook для бота
            const url = new URL(request.url);
            if (url.pathname === '/webhook') {
                await bot.handleUpdate(await request.json());
                return new Response('OK', { status: 200 });
            }
            return new Response('Bot is running', { status: 200 });
        } catch (error) {
            console.error('Error:', error);
            return new Response('Error', { status: 500 });
        }
    }
};
