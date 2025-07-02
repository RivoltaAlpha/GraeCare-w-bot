// bot.js - Complete Telegram bot with webhook support
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const GraeBotKnowledgeBase = require('./knowledgeBase');

// Environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL; // Your HTTPS URL (should be full URL)
const PORT = process.env.PORT || 3000;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

// Initialize bot WITHOUT polling for webhook mode
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
const kb = new GraeBotKnowledgeBase();

// Express app for webhook
const app = express();
app.use(express.json());

// Set webhook - FIXED: Don't append bot token to URL
const setWebhook = async () => {
  try {
    // FIXED: Use the webhook URL directly without appending bot token
    const webhookUrl = TELEGRAM_WEBHOOK_URL;
    await bot.setWebHook(webhookUrl);
    console.log(`Webhook set to: ${webhookUrl}`);
  } catch (error) {
    console.error('Failed to set webhook:', error);
  }
};

// FIXED: Webhook route should be /telegram/webhook (not with bot token)
app.post('/telegram/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'GraeBot is running!', timestamp: new Date().toISOString() });
});

// Additional health check for webhook
app.get('/telegram/webhook', (req, res) => {
  res.json({ status: 'Webhook endpoint is ready', method: 'POST required' });
});

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🌸 *Welcome to GraeBot!* 🌸

I'm here to help you with women's health questions, product information, and spa services.

*What you can ask me:*
• Health conditions (PCOS, fibroids, period pain, etc.)
• Product benefits and pricing
• Spa services information
• Delivery details

*Quick commands:*
/help - Show this message
/products - Browse all products
/services - View spa services
/delivery - Delivery information

Just type your question and I'll help you find the answer! 💗
  `;

  const quickReplies = kb.getQuickReplies();
  const keyboard = [];
  
  // Create inline keyboard with quick replies (2 per row)
  for (let i = 0; i < quickReplies.length; i += 2) {
    const row = [];
    row.push({ text: quickReplies[i].text, callback_data: `search_${quickReplies[i].query}` });
    if (quickReplies[i + 1]) {
      row.push({ text: quickReplies[i + 1].text, callback_data: `search_${quickReplies[i + 1].query}` });
    }
    keyboard.push(row);
  }

  bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
🆘 *How to use GraeBot:*

*Ask questions like:*
• "What is PCOS?"
• "How much is Ashwagandha?"
• "What helps with period pain?"
• "Do you offer massage services?"
• "How does delivery work?"

*Commands:*
/start - Welcome message
/products - Browse products
/services - Spa services
/delivery - Delivery info
/help - This help message

I understand natural language, so feel free to ask in your own words! 💗
  `, { parse_mode: 'Markdown' });
});

// Products command
bot.onText(/\/products/, (msg) => {
  const chatId = msg.chat.id;
  const products = kb.getProductsByCategory('all');
  
  let response = "🛍️ *GraeCare Products & Pricing:*\n\n";
  
  products.forEach(product => {
    response += `*${product.name}*\n`;
    response += `💰 ${product.price}\n`;
    response += `✨ ${product.benefits}\n\n`;
  });

  response += "*Ask me about any specific product for detailed information!*";

  bot.sendMessage(chatId, response, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🔍 Search Products', callback_data: 'search_products' },
        { text: '💰 Price Check', callback_data: 'search_pricing' }
      ]]
    }
  });
});

// Services command
bot.onText(/\/services/, (msg) => {
  const chatId = msg.chat.id;
  const results = kb.search('services', 'services', 10);
  const response = kb.formatTelegramResponse(results, 'spa services');
  
  bot.sendMessage(chatId, response, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '💆‍♀️ Massage Info', callback_data: 'search_massage' },
        { text: '✨ Other Services', callback_data: 'search_services' }
      ]]
    }
  });
});

// Delivery command
bot.onText(/\/delivery/, (msg) => {
  const chatId = msg.chat.id;
  const results = kb.search('delivery', 'delivery', 5);
  const response = kb.formatTelegramResponse(results, 'delivery information');
  
  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// Handle callback queries (inline button presses)
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  // Extract search query from callback data
  if (data.startsWith('search_')) {
    const query = data.replace('search_', '');
    const results = kb.search(query, 'all', 3);
    let response = kb.formatTelegramResponse(results, query);

    // Add helpful suggestions if no results found
    if (results.length === 0) {
      response += `\n\n💡 *Try asking about:*\n• Health conditions\n• Product benefits\n• Spa services\n• Delivery information`;
    }

    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
  }

  // Answer the callback query
  bot.answerCallbackQuery(callbackQuery.id);
});

// Handle regular text messages (main knowledge base search)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Skip if it's a command
  if (text && text.startsWith('/')) return;
  
  // Skip if no text
  if (!text) return;

  console.log(`Received message: "${text}" from chat ${chatId}`);

  // Search knowledge base
  const results = kb.search(text, 'all', 3);
  let response = kb.formatTelegramResponse(results, text);

  // Add helpful suggestions if no results found
  if (results.length === 0) {
    response += `\n\n💡 *Try asking about:*\n• Health conditions (PCOS, fibroids)\n• Product benefits and pricing\n• Spa and massage services\n• Delivery information\n\nOr use the /help command for more options!`;
  }

  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' })
    .catch(err => console.error('Error sending message:', err));
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Set webhook after server starts
  if (TELEGRAM_WEBHOOK_URL) {
    await setWebhook();
  } else {
    console.warn('TELEGRAM_WEBHOOK_URL not set - webhook not configured');
  }
});