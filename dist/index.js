const express = require('express');
const axios = require('axios');
const app = express();
// Middleware
app.use(express.json());
// Your WhatsApp Business API credentials
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // Your access token
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
// Grae Care Knowledge Base
const graeKnowledge = {
    intro: `Hi there! 🌿 I'm Grae, your go-to wellness companion from Grae Care.

I'm here to support you with all things women's health, from natural solutions and product recommendations to everyday wellness tips.

Grae Care is rooted in grace and dedicated to holistic feminine care, using nature-led remedies to meet the real needs of women, just like you.

What would you like to explore today? 🌸`,
    menu: `Thanks for reaching out! 🌿 I'm here to support you on your wellness journey.

Here's how I can help:

• Women's Health Support: I can guide you through common concerns like:
  - PCOS
  - Period pain
  - Hormonal acne
  - Fibroids
  - Endometriosis
  - Menopause
  - Fertility support

• Product Recommendations: Explore our natural, thoughtfully formulated products, designed to work in harmony with your body.

• Spa & Self-Care Services: Curious about our spa treatments? I can help you choose what's right for you.

Let me know what you'd like help with today, I've got you.`,
    pcos: `PCOS is caused by a hormonal imbalance, often involving elevated androgens and insulin resistance.

Common symptoms include:
• Irregular periods
• Acne or breakouts
• Weight gain or difficulty losing weight

Here's what I recommend for natural support:

• Insulin Resistance PCOS Kit -- KShs 8,400
Link: https://graecare.com/product/insulin-resistance-pcos-kit/

• Adrenal PCOS Kit -- KShs 6,100
Link: https://graecare.com/product/adrenal-pcos-kit/

• Inflammatory PCOS Kit -- KShs 6,750
Link: https://graecare.com/product/inflammatory-pcos-kit/

You can take our PCOS Quiz for a more customized solution:
https://graecare.com/pcos-quiz-form/`,
    yeastInfection: `Yeast infections are often caused by imbalances in your vaginal flora, when the natural pH shifts or candida overgrows.

Common triggers include:
• Antibiotic use
• Hormonal changes
• Tight or synthetic underwear
• High sugar intake
• Poor vaginal hygiene or harsh soaps

To support healing and restore balance, I recommend:

*Boric Acid Suppositories*
• 14 Pack -- KShs 1,600
Link: https://graecare.com/product/boric-acid-suppositories-14-pack/

• 7 Pack -- KShs 1,000
Link: https://graecare.com/product/boric-acid-suppositories-7-pack/

*Candida Detox Tea* -- KShs 800
Link: https://graecare.com/product/candida-detox-tea/

*Yeast Infection Bundle* -- KShs 4,200
Link: https://graecare.com/product/yeast-infection-fighting-kit/

Let me know if you'd like guidance on how to use them!`,
    periodPain: `Menstrual pain is often caused by an overproduction of prostaglandins, hormone-like compounds that trigger uterine cramps and inflammation.

You may experience:
• Cramping in the lower abdomen or back
• Nausea or bloating
• Fatigue or mood changes

For natural relief, I recommend:

• Magnesium Glycinate -- KShs 1,600
Link: https://graecare.com/product/magnesium/
*Helps with cramps, bloating, mood swings, and breast tenderness*

• Black Cohosh Capsules -- KShs 1,800
Link: https://graecare.com/product/black-cohosh-capsules/
*Effectively manages menstrual cramps and helps with ovulation*`,
    spa: `Welcome to the GraeCare Spa! 🌸

A calm, supportive space designed for your full-body wellness. We offer natural, restorative treatments:

• Professional waxing - from precise eyebrow shaping to full-body treatments
• Therapeutic massages - Swedish, deep tissue, or our signature healing blend
• Reflexology sessions - targeting key pressure points for inner balance

Every visit starts with a one-on-one consultation, tailored to your needs.

Ready to book your self-care session?
Link: https://graecare.com/grae-care-spa/`,
    contact: `We'd love to hear from you! 💚

📞 Call us: 0712 345 678
📧 Email us: info@graecare.com

We're always happy to chat and assist you!`,
    order: `To place your order:
1. Click on a Product Photo or Name for detailed information
2. Choose your specification and quantity
3. Click 'Buy Now'
4. Enter delivery address and details
5. Review your order carefully
6. Proceed to payment

We accept M-Pesa and cash (before or after delivery).`
};
// Message classification function
function classifyMessage(message) {
    const text = message.toLowerCase();
    if (text.includes('pcos'))
        return 'pcos';
    if (text.includes('yeast') || text.includes('infection') || text.includes('candida'))
        return 'yeastInfection';
    if (text.includes('period') || text.includes('cramp') || text.includes('menstrual'))
        return 'periodPain';
    if (text.includes('spa') || text.includes('massage') || text.includes('wax'))
        return 'spa';
    if (text.includes('contact') || text.includes('phone') || text.includes('call'))
        return 'contact';
    if (text.includes('order') || text.includes('buy') || text.includes('purchase'))
        return 'order';
    if (text.includes('menu') || text.includes('help') || text.includes('options'))
        return 'menu';
    if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('start'))
        return 'intro';
    return 'menu'; // Default response
}
// Send WhatsApp message function
async function sendWhatsAppMessage(phoneNumber, message) {
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const data = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
            body: message
        }
    };
    try {
        await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Message sent successfully');
    }
    catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
    }
}
// User state management (in production, use a database)
const userSessions = {};
// Webhook verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        console.log('Webhook verified successfully!');
        res.status(200).send(challenge);
    }
    else {
        res.status(403).send('Verification failed');
    }
});
// Webhook for receiving messages
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        if (body.object === 'whatsapp_business_account') {
            body.entry.forEach(entry => {
                entry.changes.forEach(change => {
                    if (change.field === 'messages') {
                        const messages = change.value.messages;
                        if (messages) {
                            messages.forEach(async (message) => {
                                const phoneNumber = message.from;
                                const messageText = message.text?.body;
                                const messageId = message.id;
                                // Avoid processing the same message twice
                                if (userSessions[phoneNumber]?.lastMessageId === messageId) {
                                    return;
                                }
                                // Initialize or update user session
                                if (!userSessions[phoneNumber]) {
                                    userSessions[phoneNumber] = {
                                        messageCount: 0,
                                        lastMessageId: messageId,
                                        preferredTopics: []
                                    };
                                }
                                userSessions[phoneNumber].messageCount++;
                                userSessions[phoneNumber].lastMessageId = messageId;
                                if (messageText) {
                                    console.log(`Received message from ${phoneNumber}: ${messageText}`);
                                    // Classify the message and get appropriate response
                                    const messageType = classifyMessage(messageText);
                                    let response = graeKnowledge[messageType];
                                    // Personalization based on user history
                                    if (userSessions[phoneNumber].messageCount === 1) {
                                        // First time user gets intro
                                        response = graeKnowledge.intro;
                                    }
                                    else if (userSessions[phoneNumber].messageCount > 1 && messageType === 'intro') {
                                        // Returning user gets menu instead of intro
                                        response = `Welcome back! 🌿 ${graeKnowledge.menu}`;
                                    }
                                    // Track user interests for personalization
                                    if (['pcos', 'yeastInfection', 'periodPain'].includes(messageType)) {
                                        if (!userSessions[phoneNumber].preferredTopics.includes(messageType)) {
                                            userSessions[phoneNumber].preferredTopics.push(messageType);
                                        }
                                    }
                                    // Send the response
                                    await sendWhatsAppMessage(phoneNumber, response);
                                    // Send follow-up suggestions based on user history
                                    if (userSessions[phoneNumber].preferredTopics.length > 0 && messageType === 'menu') {
                                        setTimeout(async () => {
                                            const followUp = "Based on our previous conversations, you might also be interested in our spa services or supplement recommendations. Just let me know! 🌸";
                                            await sendWhatsAppMessage(phoneNumber, followUp);
                                        }, 2000);
                                    }
                                }
                            });
                        }
                    }
                });
            });
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Grae Care WhatsApp Bot is running' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Grae Care WhatsApp webhook is listening on port ${PORT}`);
});
module.exports = app;
