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



// whatapp bot
// ...existing code...

const axios = require('axios');

// Meta WhatsApp Cloud API credentials
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_CLOUD_API_VERSION || 'v16.0';
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

// WhatsApp message formatting helper
function formatWhatsAppResponse(results, query) {
  if (results.length === 0) {
    return `I couldn't find specific information about "${query}". 

💡 *Try asking about:*
• Health conditions (PCOS, fibroids, period pain)
• Product benefits and pricing  
• Spa and massage services
• Delivery information

You can also ask questions like:
• "What is PCOS?"
• "How much is Ashwagandha?"
• "Do you offer massage services?"`;
  }

  let response = `🌸 *Here's what I found about "${query}":*\n\n`;
  
  results.forEach((result, index) => {
    response += `*${result.title}*\n`;
    response += `${result.content}\n`;
    if (result.price) {
      response += `💰 Price: ${result.price}\n`;
    }
    if (index < results.length - 1) {
      response += '\n---\n\n';
    }
  });

  response += '\n\n💬 Feel free to ask me anything else about women\'s health, products, or services!';
  return response;
}

// Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`WhatsApp message sent to ${to}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
}

// Send WhatsApp welcome message with quick reply buttons
async function sendWhatsAppWelcome(to) {
  const welcomeMessage = `🌸 *Welcome to GraeBot!* 🌸

I'm here to help you with women's health questions, product information, and spa services.

*What you can ask me:*
• Health conditions (PCOS, fibroids, period pain, etc.)
• Product benefits and pricing
• Spa services information  
• Delivery details

*Try asking:*
• "What is PCOS?"
• "Show me your products"
• "How much is Ashwagandha?"
• "Do you offer massage services?"
• "How does delivery work?"

Just type your question and I'll help you find the answer! 💗`;

  return await sendWhatsAppMessage(to, welcomeMessage);
}

// Handle different types of user queries
function processUserQuery(text) {
  const lowerText = text.toLowerCase();
  
  // Handle common greetings
  if (lowerText.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return 'greeting';
  }
  
  // Handle help requests
  if (lowerText.match(/(help|what can you do|commands)/)) {
    return 'help';
  }
  
  // Handle product queries
  if (lowerText.match(/(products|price|cost|buy|purchase|shop)/)) {
    return 'products';
  }
  
  // Handle service queries
  if (lowerText.match(/(service|massage|spa|treatment)/)) {
    return 'services';
  }
  
  // Handle delivery queries
  if (lowerText.match(/(delivery|shipping|order)/)) {
    return 'delivery';
  }
  
  return 'search';
}

// Generate contextual responses
function generateContextualResponse(queryType, text, results) {
  switch (queryType) {
    case 'greeting':
      return `Hello! 👋 Welcome to GraeBot! 

I'm here to help you with women's health questions, product information, and spa services.

What would you like to know about today?`;

    case 'help':
      return `🆘 *How I can help you:*

*Ask me about:*
• Health conditions (PCOS, fibroids, period pain)
• Product benefits and pricing
• Spa and massage services  
• Delivery information

*Example questions:*
• "What is PCOS?"
• "How much is Ashwagandha?"
• "What helps with period pain?"
• "Do you offer massage services?"
• "How does delivery work?"

Just type your question naturally! 💗`;

    case 'products':
      const products = kb.getProductsByCategory('all');
      let productResponse = "🛍️ *GraeCare Products & Pricing:*\n\n";
      
      products.slice(0, 5).forEach(product => {
        productResponse += `*${product.name}*\n`;
        productResponse += `💰 ${product.price}\n`;
        productResponse += `✨ ${product.benefits}\n\n`;
      });
      
      productResponse += "Ask me about any specific product for detailed information!";
      return productResponse;

    case 'services':
      const serviceResults = kb.search('services', 'services', 5);
      return formatWhatsAppResponse(serviceResults, 'our services');

    case 'delivery':
      const deliveryResults = kb.search('delivery', 'delivery', 3);
      return formatWhatsAppResponse(deliveryResults, 'delivery information');

    default:
      return formatWhatsAppResponse(results, text);
  }
}

// Verify webhook
app.get('/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
});

// Handle incoming WhatsApp messages
app.post('/whatsapp/webhook', async (req, res) => {
  try {
    const body = req.body;

    // Check if this is a message event
    if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Sender's phone number
      const messageId = message.id;
      const timestamp = message.timestamp;

      // Handle different message types
      let text = '';
      let messageType = message.type;

      switch (messageType) {
        case 'text':
          text = message.text?.body;
          break;
        case 'button':
          text = message.button?.text;
          break;
        case 'interactive':
          text = message.interactive?.button_reply?.title || 
                 message.interactive?.list_reply?.title;
          break;
        default:
          text = 'Hi'; // Default to greeting for unsupported message types
      }

      if (!text) {
        console.log('No text content found in message');
        res.sendStatus(200);
        return;
      }

      console.log(`Received WhatsApp message: "${text}" from ${from} (${messageType})`);

      // Process the query type
      const queryType = processUserQuery(text);
      
      // Search knowledge base for relevant information
      const results = queryType === 'search' ? kb.search(text, 'all', 3) : [];
      
      // Generate appropriate response
      const response = generateContextualResponse(queryType, text, results);

      // Send response back via WhatsApp
      await sendWhatsAppMessage(from, response);

      // Mark message as read (optional)
      await axios.post(
        `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

    } else {
      console.log('Received WhatsApp webhook event (not a message):', JSON.stringify(body, null, 2));
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    res.sendStatus(500);
  }
});

// Send welcome message endpoint (for testing)
app.post('/whatsapp/send-welcome', async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const result = await sendWhatsAppWelcome(to);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route for WhatsApp
app.get('/whatsapp/health', (req, res) => {
  res.json({ 
    status: 'WhatsApp webhook endpoint is ready', 
    method: 'POST required',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;