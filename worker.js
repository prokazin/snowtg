// === ПОЛНЫЙ КОД ДЛЯ CLOUDFLARE WORKER ===

const BOT_TOKEN = '8803506830:AAFtJO4nJt4l5Cfzl_LHlQhAXIVsMorrN18';
const APP_URL = 'https://snowtg.nazar-bronnikov22.workers.dev/';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname === '/webhook') {
    try {
      const body = await request.json()
      await handleTelegramMessage(body)
      return new Response('OK', { status: 200 })
    } catch (e) {
      console.error('Error:', e)
      return new Response('Error', { status: 500 })
    }
  }
  
  return Response.redirect(APP_URL, 302)
}

async function handleTelegramMessage(message) {
  const chatId = message.message?.chat?.id
  const text = message.message?.text
  const callback = message.callback_query
  
  if (!chatId) return
  
  // Обработка callback от кнопок
  if (callback) {
    await handleCallback(callback)
    return
  }
  
  if (!text) return
  
  let replyText = ''
  let buttons = []
  
  switch (text) {
    case '/start':
      replyText = getStartText()
      buttons = [
        [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
        [{ text: '📢 Оповещения', callback_data: 'check_announcement' }],
        [{ text: '📞 Контакты', callback_data: 'contacts' }]
      ]
      break
      
    case '/help':
      replyText = getHelpText()
      buttons = [
        [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
        [{ text: '🏔️ Главное меню', callback_data: 'start' }]
      ]
      break
      
    case '/catalog':
      replyText = getCatalogText()
      buttons = [
        [{ text: '🛒 Смотреть каталог', web_app: { url: APP_URL } }]
      ]
      break
      
    case '/services':
      replyText = getServicesText()
      buttons = [
        [{ text: '🔧 Записаться на сервис', web_app: { url: APP_URL } }]
      ]
      break
      
    case '/contacts':
      replyText = getContactsText()
      buttons = [
        [{ text: '📞 Позвонить', url: 'tel:+79991234567' }],
        [{ text: '📍 Показать на карте', url: 'https://maps.google.com/?q=Москва+ул+Сноубордная+15' }]
      ]
      break
      
    default:
      replyText = getUnknownText()
      buttons = [
        [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
        [{ text: '🏔️ Главное меню', callback_data: 'start' }]
      ]
  }
  
  await sendTelegramMessage(chatId, replyText, buttons)
}

async function handleCallback(callback) {
  const chatId = callback.message?.chat?.id
  const data = callback.data
  
  if (!chatId) return
  
  let replyText = ''
  let buttons = []
  
  switch (data) {
    case 'start':
      replyText = getStartText()
      buttons = [
        [{ text: '🚀 Открыть магазин', web_app: { url: APP_URL } }],
        [{ text: '📢 Оповещения', callback_data: 'check_announcement' }],
        [{ text: '📞 Контакты', callback_data: 'contacts' }]
      ]
      break
      
    case 'check_announcement':
      // Проверяем оповещение
      const announcement = await getAnnouncementFromAPI()
      if (announcement) {
        replyText = `📢 Оповещение от магазина:\n\n${announcement}`
      } else {
        replyText = '📢 Активных оповещений нет. Все работает в штатном режиме! 🏔️'
      }
      buttons = [
        [{ text: '🏔️ Главное меню', callback_data: 'start' }]
      ]
      break
      
    case 'contacts':
      replyText = getContactsText()
      buttons = [
        [{ text: '📞 Позвонить', url: 'tel:+79991234567' }],
        [{ text: '📍 Показать на карте', url: 'https://maps.google.com/?q=Москва+ул+Сноубордная+15' }],
        [{ text: '🏔️ Главное меню', callback_data: 'start' }]
      ]
      break
  }
  
  await sendTelegramMessage(chatId, replyText, buttons)
}

// === ПОЛУЧЕНИЕ ОПОВЕЩЕНИЯ ИЗ LOCALSTORAGE (через API) ===
async function getAnnouncementFromAPI() {
  try {
    const response = await fetch(APP_URL + 'api/announcement')
    const data = await response.json()
    return data.text || null
  } catch (e) {
    return null
  }
}

// === ТЕКСТЫ ===

function getStartText() {
  return `🏔️ Добро пожаловать в Snowboard Store!

❄️ Твой гид в мире сноубординга!

Здесь ты найдешь:
🏂 Сноуборды от ведущих брендов
👢 Ботинки для любого стиля катания
⛑️ Шлемы и защита
🎭 Маски и аксессуары
🔧 Сервис и обслуживание
📞 Контакты и поддержка

🔥 Начни свое приключение уже сегодня!`
}

function getHelpText() {
  return `❓ Помощь — Snowboard Store

📌 Основные разделы:
🛒 /catalog - Открыть каталог товаров
🔧 /services - Услуги и сервис
📞 /contacts - Контакты
🏂 /boards - Сноуборды
🔗 /bindings - Крепления
👢 /boots - Ботинки
⛑️ /helmets - Шлемы
🎭 /masks - Маски
🎒 /covers - Чехлы

📱 Мини-приложение:
Нажми на кнопку "Открыть магазин" ниже!

❄️ Удачи на склонах!`
}

function getCatalogText() {
  return `🛒 Каталог товаров

🏂 /boards — Сноуборды
🔗 /bindings — Крепления
👢 /boots — Ботинки
⛑️ /helmets — Шлемы
🎭 /masks — Маски
🎒 /covers — Чехлы

🔧 /services — Услуги и сервис
📞 /contacts — Контакты

👇 Нажми на кнопку ниже, чтобы открыть витрину!

Скидки и акции ждут тебя! ❄️`
}

function getServicesText() {
  return `🔧 Сервис и обслуживание

🔥 Наши услуги:
• Заточка кантов — 2 500 ₽
• Смазка скользяка — 3 000 ₽
• Ремонт скользяка — 4 500 ₽
• Установка креплений — 2 000 ₽
• Комплексное ТО — 8 000 ₽
• Диагностика доски — 1 500 ₽

⏱️ Быстрое обслуживание
🛡️ Гарантия на все работы

👇 Открой мини-приложение для подробностей!`
}

function getContactsText() {
  return `📞 Контакты

📍 Адрес: г. Москва, ул. Сноубордная, д. 15
📱 Телефон: +7 (999) 123-45-67
📧 Email: info@snowboard-store.ru
🕐 Режим работы: Пн-Вс: 9:00 - 19:00

🌐 Наш сайт: ${APP_URL}

📱 Свяжитесь с нами любым удобным способом!
Мы всегда рады помочь! 🏔️`
}

function getUnknownText() {
  return `🤔 Я не понял ваш запрос.

Доступные команды:
/start — Главное меню
/catalog — Каталог
/services — Услуги
/contacts — Контакты
/help — Помощь

👇 Или нажми на кнопку ниже, чтобы открыть приложение!

❄️ Сноуборд-сезон ждет тебя!`
}

// === ОТПРАВКА СООБЩЕНИЯ ===

async function sendTelegramMessage(chatId, text, buttons = []) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  }
  
  if (buttons.length > 0) {
    payload.reply_markup = {
      inline_keyboard: buttons
    }
  }
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}
