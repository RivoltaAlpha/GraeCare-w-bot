// knowledgeBase.js - Core knowledge base module
class GraeBotKnowledgeBase {
  constructor() {
    this.knowledgeBase = {
      conditions: [
        {
          id: 'fibroids',
          question: 'What are fibroids and how can they be managed?',
          answer: 'Fibroids are noncancerous growths in or on the uterus that can cause heavy periods, pain, and bloating. They\'re influenced by hormones like estrogen.',
          supportiveProducts: ['Hormone Balance Tonic', 'Red Raspberry Capsules'],
          tags: ['fibroids', 'heavy periods', 'pain', 'bloating', 'estrogen'],
          category: 'conditions'
        },
        {
          id: 'pcos',
          question: 'What is PCOS and what are its symptoms?',
          answer: 'PCOS (Polycystic Ovary Syndrome) is caused by hormonal imbalance, often with elevated androgens and insulin resistance. Symptoms include irregular periods, acne, and weight gain.',
          supportiveProducts: ['PCOS Control Tonic', 'Spearmint Capsules'],
          tags: ['pcos', 'polycystic ovary syndrome', 'irregular periods', 'acne', 'weight gain', 'androgens'],
          category: 'conditions'
        },
        {
          id: 'endometriosis',
          question: 'What is endometriosis?',
          answer: 'A condition where tissue similar to the uterine lining grows outside the uterus, leading to pain and fertility issues.',
          supportiveProducts: ['Endo Tonic', 'Turmeric Capsules'],
          tags: ['endometriosis', 'pain', 'fertility', 'uterine lining'],
          category: 'conditions'
        },
        {
          id: 'hormonal-acne',
          question: 'What causes hormonal acne?',
          answer: 'Often triggered by hormonal fluctuations, particularly excess androgens. Appears on the jawline, chin, and cheeks.',
          supportiveProducts: ['Acne Tonic', 'Zinc Capsules'],
          tags: ['hormonal acne', 'androgens', 'jawline', 'chin', 'cheeks'],
          category: 'conditions'
        },
        {
          id: 'irregular-periods',
          question: 'What causes irregular periods?',
          answer: 'Can result from stress, weight changes, or hormonal imbalance.',
          supportiveProducts: ['Cycle Balance Tonic', 'Vitex Capsules'],
          tags: ['irregular periods', 'stress', 'weight changes', 'hormonal imbalance'],
          category: 'conditions'
        },
        {
          id: 'painful-periods',
          question: 'Why do I have painful periods?',
          answer: 'Typically linked to prostaglandin overproduction, causing uterine cramps.',
          supportiveProducts: ['Period Pain Tonic', 'Cramp Bark Capsules'],
          tags: ['painful periods', 'dysmenorrhea', 'cramps', 'prostaglandin'],
          category: 'conditions'
        },
        {
          id: 'fertility',
          question: 'What can cause fertility challenges?',
          answer: 'May be caused by hormonal imbalance, PCOS, fibroids, or lifestyle factors.',
          supportiveProducts: ['Fertility Boost Tonic', 'Maca Root Capsules'],
          tags: ['fertility', 'conception', 'hormonal imbalance', 'lifestyle'],
          category: 'conditions'
        },
        {
          id: 'pms',
          question: 'What causes PMS and mood swings?',
          answer: 'Often triggered by fluctuations in estrogen and progesterone.',
          supportiveProducts: ['PMS Support Tonic', 'Magnesium Capsules'],
          tags: ['pms', 'mood swings', 'estrogen', 'progesterone'],
          category: 'conditions'
        },
        {
          id: 'menopause',
          question: 'What happens during perimenopause and menopause?',
          answer: 'Hormonal shifts during this transition cause hot flashes, mood changes, and sleep disturbances.',
          supportiveProducts: ['Menopause Support Tonic', 'Black Cohosh Capsules'],
          tags: ['perimenopause', 'menopause', 'hot flashes', 'mood changes', 'sleep'],
          category: 'conditions'
        },
        {
          id: 'infections',
          question: 'What causes bacterial vaginosis and yeast infections?',
          answer: 'Caused by imbalances in vaginal flora.',
          supportiveProducts: ['Feminine Balance Tonic', 'Probiotic Capsules'],
          tags: ['bacterial vaginosis', 'yeast infections', 'vaginal flora', 'bv'],
          category: 'conditions'
        }
      ],
      products: [
        {
          id: 'ashwagandha',
          question: 'What are the benefits of Ashwagandha?',
          answer: 'Ashwagandha supports the body\'s stress response by regulating cortisol levels. It helps with anxiety, fatigue, and hormonal balance. For women, it can promote better sleep, improve mood, and support thyroid function.',
          price: 'KSh 2,000',
          tags: ['ashwagandha', 'stress', 'cortisol', 'anxiety', 'fatigue', 'sleep', 'thyroid'],
          category: 'products'
        },
        {
          id: 'vitex',
          question: 'How does Vitex help with hormonal balance?',
          answer: 'Vitex supports hormonal balance by influencing the pituitary gland, which helps regulate estrogen and progesterone. It\'s often used to support cycle regularity and ease PMS symptoms.',
          price: 'KSh 2,000',
          tags: ['vitex', 'chaste tree berry', 'hormonal balance', 'pituitary', 'cycle regularity', 'pms'],
          category: 'products'
        },
        {
          id: 'spearmint',
          question: 'How does Spearmint help with PCOS?',
          answer: 'Known for reducing androgen levels, which helps manage symptoms of PCOS like hirsutism (excess hair growth) and acne.',
          price: 'KSh 2,000',
          tags: ['spearmint', 'androgens', 'pcos', 'hirsutism', 'hair growth', 'acne'],
          category: 'products'
        },
        {
          id: 'red-raspberry',
          question: 'What are the benefits of Red Raspberry Leaf?',
          answer: 'Traditionally used to tone the uterus, this herb can ease menstrual cramps and support overall reproductive health.',
          price: 'KSh 2,000',
          tags: ['red raspberry leaf', 'uterus', 'menstrual cramps', 'reproductive health'],
          category: 'products'
        },
        {
          id: 'maca-root',
          question: 'What does Maca Root do?',
          answer: 'Adaptogenic root that supports energy, mood, and libido. It\'s often included in fertility blends and hormone-balancing protocols.',
          price: 'KSh 2,000',
          tags: ['maca root', 'adaptogenic', 'energy', 'mood', 'libido', 'fertility'],
          category: 'products'
        },
        {
          id: 'black-cohosh',
          question: 'How does Black Cohosh help with menopause?',
          answer: 'Helps manage menopausal symptoms like hot flashes and mood swings by supporting estrogen balance.',
          price: 'KSh 2,000',
          tags: ['black cohosh', 'menopause', 'hot flashes', 'mood swings', 'estrogen'],
          category: 'products'
        },
        {
          id: 'magnesium',
          question: 'What are the benefits of Magnesium?',
          answer: 'Calms the nervous system and supports muscle relaxation. Crucial for easing PMS-related tension and improving sleep.',
          price: 'KSh 2,000',
          tags: ['magnesium', 'nervous system', 'muscle relaxation', 'pms', 'sleep'],
          category: 'products'
        },
        {
          id: 'zinc',
          question: 'How does Zinc help with skin health?',
          answer: 'Supports skin healing and immune function. Also beneficial for hormonal acne.',
          price: 'KSh 2,000',
          tags: ['zinc', 'skin healing', 'immune function', 'hormonal acne'],
          category: 'products'
        },
        {
          id: 'turmeric',
          question: 'What are the benefits of Turmeric?',
          answer: 'An anti-inflammatory powerhouse. Helps manage pain from endometriosis and reduce systemic inflammation.',
          price: 'KSh 2,000',
          tags: ['turmeric', 'anti-inflammatory', 'endometriosis', 'pain', 'inflammation'],
          category: 'products'
        },
        {
          id: 'probiotics',
          question: 'How do Probiotics help with feminine health?',
          answer: 'Restore healthy vaginal flora, supporting relief from BV and yeast infections.',
          price: 'KSh 2,000',
          tags: ['probiotics', 'vaginal flora', 'bv', 'bacterial vaginosis', 'yeast infections'],
          category: 'products'
        },
        {
          id: 'cramp-bark',
          question: 'What does Cramp Bark do?',
          answer: 'Eases uterine cramps and helps relieve menstrual pain naturally.',
          price: 'KSh 2,000',
          tags: ['cramp bark', 'uterine cramps', 'menstrual pain'],
          category: 'products'
        }
      ],
      services: [
        {
          id: 'waxing',
          question: 'What waxing services do you offer?',
          answer: 'Professional waxing tailored to your needs, from eyebrow shaping to full-body treatments. We prioritize hygiene and comfort, ensuring smooth, radiant skin every time.',
          tags: ['waxing', 'eyebrow', 'full-body', 'hygiene', 'skin'],
          category: 'services'
        },
        {
          id: 'massage',
          question: 'What massage services are available?',
          answer: 'Choose from Swedish, deep tissue, or combined healing massage with reflexology. Our therapists personalize each session to relieve muscle tension, improve circulation, and help you unwind.',
          tags: ['massage', 'swedish', 'deep tissue', 'reflexology', 'muscle tension', 'circulation'],
          category: 'services'
        },
        {
          id: 'reflexology',
          question: 'What is reflexology and how does it help?',
          answer: 'A targeted therapy applying pressure to feet, hands, or head and neck to promote relaxation and overall wellbeing. Reflexology at GraeCare Spa helps reduce stress, support circulation, and ease common discomforts.',
          tags: ['reflexology', 'feet', 'hands', 'head', 'neck', 'relaxation', 'stress', 'circulation'],
          category: 'services'
        }
      ],
      delivery: [
        {
          id: 'delivery-info',
          question: 'How does delivery work?',
          answer: 'We offer fast, discreet delivery across Kenya. Orders within Nairobi are usually delivered same day or next day. Outside Nairobi, delivery typically takes 1–2 days. You\'ll receive a confirmation message with tracking information once your order is placed.',
          tags: ['delivery', 'nairobi', 'kenya', 'same day', 'tracking', 'discreet'],
          category: 'delivery'
        }
      ],
      pricing: [
        { name: 'Acne Tonic', price: 'KSh 2,200' },
        { name: 'Ashwagandha Capsules', price: 'KSh 2,000' },
        { name: 'Bacterial Vaginosis Bundle', price: 'KSh 4,500' },
        { name: 'Black Cohosh', price: 'KSh 2,000' },
        { name: 'Boric Acid Suppositories', price: 'KSh 2,000' },
        { name: 'Bundle for Menstrual Pain', price: 'KSh 4,700' },
        { name: 'Bundle for PCOS', price: 'KSh 5,300' },
        { name: 'Bundle for Yeast Infections', price: 'KSh 4,200' },
        { name: 'Candida Cleanse Capsules', price: 'KSh 2,300' },
        { name: 'Castor Oil', price: 'KSh 1,400' },
        { name: 'Castor Oil Pack', price: 'KSh 2,300' },
        { name: 'Cycle Balance Tonic', price: 'KSh 2,200' },
        { name: 'Dandelion Root Capsules', price: 'KSh 2,000' },
        { name: 'Endo Tonic', price: 'KSh 2,200' },
        { name: 'Feminine Balance Tonic', price: 'KSh 2,200' },
        { name: 'Fertility Boost Tonic', price: 'KSh 2,400' },
        { name: 'Fibroid Relief Bundle', price: 'KSh 5,600' },
        { name: 'Fibroid Relief Tea', price: 'KSh 1,500' },
        { name: 'Gut Restore', price: 'KSh 2,500' },
        { name: 'Hormone Balance Tonic', price: 'KSh 2,200' },
        { name: 'Iron Tonic', price: 'KSh 2,000' },
        { name: 'Liver Cleanse Tonic', price: 'KSh 2,200' },
        { name: 'Maca Root Capsules', price: 'KSh 2,000' },
        { name: 'Magnesium Capsules', price: 'KSh 2,000' },
        { name: 'Menopause Support Tonic', price: 'KSh 2,200' },
        { name: 'Multivitamin Capsules', price: 'KSh 2,200' },
        { name: 'Ovulation & Pregnancy Test Strips', price: 'KSh 1,200' },
        { name: 'PCOS Control Tonic', price: 'KSh 2,200' },
        { name: 'Period Pain Tonic', price: 'KSh 2,200' },
        { name: 'PMS Support Tonic', price: 'KSh 2,200' },
        { name: 'Postpartum Tonic', price: 'KSh 2,200' },
        { name: 'Probiotic Capsules', price: 'KSh 2,000' },
        { name: 'Red Raspberry Leaf', price: 'KSh 2,000' },
        { name: 'Reproductive Health Bundle', price: 'KSh 5,300' },
        { name: 'Spearmint Capsules', price: 'KSh 2,000' },
        { name: 'Turmeric Capsules', price: 'KSh 2,000' },
        { name: 'Uterine Strength Tea', price: 'KSh 1,800' },
        { name: 'Vitex Capsules', price: 'KSh 2,000' }
      ]
    };

    // Flatten all Q&A pairs for searching
    this.allQAPairs = this._flattenKnowledgeBase();
  }

  _flattenKnowledgeBase() {
    const pairs = [];
    Object.entries(this.knowledgeBase).forEach(([category, items]) => {
      if (category !== 'pricing') {
        items.forEach(item => {
          pairs.push({
            ...item,
            category
          });
        });
      }
    });
    return pairs;
  }

  // Main search function
  search(query, category = 'all', limit = 5) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    let results = this.allQAPairs;

    // Filter by category
    if (category !== 'all') {
      results = results.filter(item => item.category === category);
    }

    // Search and score results
    const scoredResults = results.map(item => {
      let score = 0;
      
      // Exact question match (highest priority)
      if (item.question.toLowerCase().includes(searchTerm)) {
        score += 100;
      }
      
      // Answer content match
      if (item.answer.toLowerCase().includes(searchTerm)) {
        score += 50;
      }
      
      // Tag matches
      if (item.tags) {
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchTerm)) {
            score += 30;
          }
        });
      }
      
      // Supportive products match
      if (item.supportiveProducts) {
        item.supportiveProducts.forEach(product => {
          if (product.toLowerCase().includes(searchTerm)) {
            score += 20;
          }
        });
      }

      // Word-by-word matching for partial searches
      const searchWords = searchTerm.split(' ');
      searchWords.forEach(word => {
        if (word.length > 2) { // Skip very short words
          if (item.question.toLowerCase().includes(word)) score += 10;
          if (item.answer.toLowerCase().includes(word)) score += 5;
        }
      });

      return { ...item, score };
    });

    // Filter out items with no matches and sort by score
    return scoredResults
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Get product price
  getProductPrice(productName) {
    const product = this.knowledgeBase.pricing.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    return product ? product.price : null;
  }

  // Get all products in a category
  getProductsByCategory(category) {
    if (category === 'all') {
      return this.knowledgeBase.pricing;
    }
    // You can extend this to filter by product categories if needed
    return this.knowledgeBase.pricing;
  }

  // Format response for Telegram
  formatTelegramResponse(searchResults, query) {
    if (searchResults.length === 0) {
      return `❌ Sorry, I couldn't find any information about "${query}". Please try rephrasing your question or ask about:\n\n• Health conditions (PCOS, fibroids, etc.)\n• Product benefits\n• Spa services\n• Delivery information`;
    }

    let response = `🔍 *Search Results for "${query}":*\n\n`;
    
    searchResults.forEach((result, index) => {
      const emoji = this._getCategoryEmoji(result.category);
      response += `${emoji} *${result.question}*\n`;
      response += `${result.answer}\n`;
      
      if (result.supportiveProducts && result.supportiveProducts.length > 0) {
        response += `\n💊 *Recommended:* ${result.supportiveProducts.join(', ')}\n`;
      }
      
      if (result.price) {
        response += `💰 *Price:* ${result.price}\n`;
      }
      
      if (index < searchResults.length - 1) {
        response += '\n---\n\n';
      }
    });

    return response;
  }

  _getCategoryEmoji(category) {
    const emojis = {
      'conditions': '🩺',
      'products': '💊',
      'services': '✨',
      'delivery': '🚚'
    };
    return emojis[category] || '💭';
  }

  // Quick replies for common questions
  getQuickReplies() {
    return [
      { text: 'PCOS help', query: 'pcos' },
      { text: 'Period pain', query: 'period pain' },
      { text: 'Hormonal acne', query: 'hormonal acne' },
      { text: 'Product prices', query: 'pricing' },
      { text: 'Delivery info', query: 'delivery' },
      { text: 'Spa services', query: 'massage' }
    ];
  }
}

// Export for use in your bot
module.exports = GraeBotKnowledgeBase;

// Example usage in your Telegram bot:
/*
const TelegramBot = require('node-telegram-bot-api');
const GraeBotKnowledgeBase = require('./knowledgeBase');

const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });
const kb = new GraeBotKnowledgeBase();

// Handle text messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Skip commands
  if (text.startsWith('/')) return;

  // Search knowledge base
  const results = kb.search(text, 'all', 3);
  const response = kb.formatTelegramResponse(results, text);
  
  bot.sendMessage(chatId, response, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        kb.getQuickReplies().map(reply => ({
          text: reply.text,
          callback_data: `search_${reply.query}`
        }))
      ]
    }
  });
});

// Handle callback queries (quick replies)
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  if (data.startsWith('search_')) {
    const query = data.replace('search_', '');
    const results = kb.search(query, 'all', 3);
    const response = kb.formatTelegramResponse(results, query);
    
    bot.editMessageText(response, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: 'Markdown'
    });
  }
});
*/