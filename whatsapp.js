const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

async function sendWhatsAppMessage(phoneNumber, messageData) {
  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    ...messageData,
  };

  try {
    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent successfully");
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
  }
}

// Interactive message templates
const messageTemplates = {
  welcome: {
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "🌿 Welcome to Grae Care",
      },
      body: {
        text: `Hi there! I'm Grae, your wellness companion.

        I'm here to support you with all things women's health, from natural solutions and product recommendations to everyday wellness tips.

        Grae Care is rooted in grace and dedicated to holistic feminine care, using nature-led remedies to meet the real needs of women, just like you.

        What would you like to explore today?`,
      },
      footer: {
        text: "Choose an option below 🌸",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "health_concerns",
              title: "🩺 Health Concerns",
            },
          },
          {
            type: "reply",
            reply: {
              id: "shop_products",
              title: "🛍️ Shop Products",
            },
          },
          {
            type: "reply",
            reply: {
              id: "spa_services",
              title: "💆‍♀️ Spa Services",
            },
          },
        ],
      },
    },
  },

  healthConcerns: {
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "🩺 Women's Health Support",
      },
      body: {
        text: "I can guide you through common women's health concerns. Select the area you'd like to explore:",
      },
      footer: {
        text: "Tap to select",
      },
      action: {
        button: "Health Topics",
        sections: [
          {
            title: "Hormonal Health",
            rows: [
              {
                id: "pcos",
                title: "PCOS",
                description: "Polycystic Ovary Syndrome support",
              },
              {
                id: "period_pain",
                title: "Period Pain",
                description: "Menstrual cramps and discomfort",
              },
              {
                id: "hormonal_acne",
                title: "Hormonal Acne",
                description: "Clear skin solutions",
              },
            ],
          },
          {
            title: "Reproductive Health",
            rows: [
              {
                id: "fibroids",
                title: "Fibroids",
                description: "Natural fibroid management",
              },
              {
                id: "yeast_infection",
                title: "Yeast Infections",
                description: "Vaginal health support",
              },
              {
                id: "uti",
                title: "UTI Support",
                description: "Urinary tract health",
              },
            ],
          },
          {
            title: "General Wellness",
            rows: [
              {
                id: "weight_loss",
                title: "Weight Management",
                description: "Healthy weight loss support",
              },
              {
                id: "vaginal_dryness",
                title: "Vaginal Dryness",
                description: "Natural lubrication support",
              },
              {
                id: "anaemia",
                title: "Anaemia",
                description: "Iron deficiency support",
              },
            ],
          },
        ],
      },
    },
  },

  shopProducts: {
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "🛍️ Shop Natural Products",
      },
      body: {
        text: `Explore our natural, thoughtfully formulated products designed to work in harmony with your body.

            Our products feature:
            ✨ Natural, organic, GMO-free ingredients
            ✨ Holistic approach to women's health
            ✨ Personalized guidance and education

            What type of products are you interested in?`,
      },
      footer: {
        text: "Select a category",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "supplement_products",
              title: "💊 Supplements",
            },
          },
          {
            type: "reply",
            reply: {
              id: "specialized_kits",
              title: "📦 Health Kits",
            },
          },
          {
            type: "reply",
            reply: {
              id: "order_info",
              title: "📋 How to Order",
            },
          },
        ],
      },
    },
  },

  spaServices: {
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "💆‍♀️ GraeCare Spa",
      },
      body: {
        text: `Welcome to the GraeCare Spa! 🌸

            A calm, supportive space designed for your full-body wellness. We offer natural, restorative treatments in a safe and serene environment.

            Every visit starts with a one-on-one consultation, tailored to your body and needs.`,
      },
      footer: {
        text: "What interests you?",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "spa_treatments",
              title: "🌿 View Treatments",
            },
          },
          {
            type: "reply",
            reply: {
              id: "book_spa",
              title: "📅 Book Session",
            },
          },
          {
            type: "reply",
            reply: {
              id: "contact_spa",
              title: "📞 Contact Us",
            },
          },
        ],
      },
    },
  },
};

// Detailed responses for specific topics
const detailedResponses = {
  pcos: {
    type: "text",
    text: `🌿 *PCOS Support*

PCOS is caused by a hormonal imbalance, often involving elevated androgens and insulin resistance.

*Common symptoms include:*
• Irregular periods
• Acne or breakouts  
• Weight gain or difficulty losing weight

*Here's what I recommend for natural support:*

💊 *Insulin Resistance PCOS Kit* - KShs 8,400
🔗 https://graecare.com/product/insulin-resistance-pcos-kit/

💊 *Adrenal PCOS Kit* - KShs 6,100  
🔗 https://graecare.com/product/adrenal-pcos-kit/

💊 *Inflammatory PCOS Kit* - KShs 6,750
🔗 https://graecare.com/product/inflammatory-pcos-kit/

📋 *Take our PCOS Quiz for a more customized solution:*
🔗 https://graecare.com/pcos-quiz-form/`,
  },

  yeast_infection: {
    type: "text",
    text: `🌿 *Yeast Infection Support*

Yeast infections are often caused by imbalances in your vaginal flora, when the natural pH shifts or candida overgrows.

*Common triggers include:*
• Antibiotic use
• Hormonal changes
• Tight or synthetic underwear
• High sugar intake
• Poor vaginal hygiene or harsh soaps

*To support healing and restore balance:*

🔸 *Boric Acid Suppositories (14 Pack)* - KShs 1,600
🔗 https://graecare.com/product/boric-acid-suppositories-14-pack/

🔸 *Boric Acid Suppositories (7 Pack)* - KShs 1,000  
🔗 https://graecare.com/product/boric-acid-suppositories-7-pack/

🔸 *Candida Detox Tea* - KShs 800
🔗 https://graecare.com/product/candida-detox-tea/

🔸 *Yeast Infection Bundle* - KShs 4,200
🔗 https://graecare.com/product/yeast-infection-fighting-kit/

Let me know if you'd like guidance on how to use them! 💚`,
  },

  period_pain: {
    type: "text",
    text: `🌿 *Period Pain Relief*

Menstrual pain is often caused by an overproduction of prostaglandins, hormone-like compounds that trigger uterine cramps and inflammation.

*You may experience:*
• Cramping in the lower abdomen or back
• Nausea or bloating
• Fatigue or mood changes

*For natural relief, I recommend:*

💊 *Magnesium Glycinate* - KShs 1,600
🔗 https://graecare.com/product/magnesium/
✨ Helps with cramps, bloating, mood swings, and breast tenderness

💊 *Black Cohosh Capsules* - KShs 1,800
🔗 https://graecare.com/product/black-cohosh-capsules/
✨ Effectively manages menstrual cramps and helps with ovulation

Both are gentle, natural solutions that work with your body's rhythms 🌸`,
  },

  hormonal_acne: {
    type: "text",
    text: `🌿 *Clear Skin Solutions*

Good skin brings confidence! There are natural supplements that can give you that healthy glow.

*Natural solutions for clearer skin:*

🌊 *Sea Moss Capsules* - Rich in vitamins, minerals, and antioxidants
🔗 https://graecare.com/product/seamoss-capsules/

🌸 *Red Clover Capsules* - Traditional remedy for skin health
🔗 https://graecare.com/product/red-clover-capsules/

🌿 *Chlorophyll Capsules* - Natural detoxifier for skin health
🔗 https://graecare.com/product/chlorophyll-capsules/

Remember, individual results may vary. It's always good to consult with a healthcare professional for persistent skin concerns 💚`,
  },

  fibroids: {
    type: "text",
    text: `🌿 *Fibroid Support*

Fibroids are non-cancerous growths that develop in or around the uterus, often during a woman's reproductive years. They can cause heavy periods, pelvic pain, bloating, and sometimes fertility issues.

*Natural support with Red Clover:*

🌸 *Red Clover Capsules*
🔗 https://graecare.com/product/red-clover-capsules/

Red clover is a naturally occurring plant used for:
• Helping shrink fibroids
• Regulating menstrual cycle  
• Supporting PMS symptoms
• Purifying blood and improving circulation

Many women find relief with consistent natural support 💚`,
  },

  uti: {
    type: "text",
    text: `🌿 *UTI Support*

A Urinary Tract Infection (UTI) is an infection in any part of the urinary system—most commonly the bladder and urethra.

*Common symptoms:*
• Burning sensation when urinating
• Frequent urge to urinate
• Cloudy or strong-smelling urine
• Lower abdominal pain

*Natural support:*

🔴 *Cranberry + Probiotic*
🔗 https://graecare.com/product/cranberryprobiotic/

This combines probiotics and cranberry in a single capsule, ideal for:
• Supporting urinary tract health
• Maintaining vaginal health  
• Helping prevent recurring UTIs

UTIs are more common in women due to shorter urethra, but natural support can help! 💚`,
  },

  weight_loss: {
    type: "text",
    text: `🌿 *Healthy Weight Management*

At Grae Care, we support healthy weight loss. Our supplements are not a quick shortcut - they help you lose weight naturally and healthily. Best results come with a healthy diet, exercise, and lifestyle changes.

*Natural weight support supplements:*

🌿 *Berberine Capsules*
🔗 https://graecare.com/product/berberine-capsules/

🌊 *Sea Moss Capsules*
🔗 https://graecare.com/product/seamoss-capsules/

🌿 *Chlorophyll Capsules*  
🔗 https://graecare.com/product/chlorophyll-capsules/

🍵 *Matcha Tea*
🔗 https://graecare.com/product/matcha-tea/

Remember: sustainable weight loss is a journey, not a destination! 💚`,
  },

  vaginal_dryness: {
    type: "text",
    text: `🌿 *Vaginal Dryness Support*

Many women experience vaginal dryness due to hormonal changes, stress, medications, or other factors. There are natural ways to support your body's balance.

*Natural supplements for lubrication support:*

🌿 *Slippery Elm Capsules*
🔗 https://graecare.com/product/slippery-elm-capsules/
✨ Soothes mucous membranes and alleviates irritation

🌿 *Ashwagandha Capsules*
• 60 Capsules: https://graecare.com/product/ashwagandha-capsules-60-capsules/
• 30 Capsules: https://graecare.com/product/ashwagandha-capsules-30-capsules/

Ashwagandha helps:
• Reduce stress
• Balance hormones
• Enhance libido
• Provide anti-inflammatory benefits

Always consult with a healthcare professional if you have underlying conditions 💚`,
  },

  anaemia: {
    type: "text",
    text: `🌿 *Anaemia Support*

Anaemia is common in women and can leave you feeling tired and lacking energy.

*Natural iron support:*

🌊 *Sea Moss Capsules*
🔗 https://graecare.com/product/seamoss-capsules/

Sea moss is rich in iron, which helps:
• Reduce chances of anaemia
• Reduce fatigue
• Leave you feeling more energetic
• Support overall vitality

Iron deficiency is especially common during menstruation, so natural support can make a real difference! 💚`,
  },

  spa_treatments: {
    type: "text",
    text: `💆‍♀️ *GraeCare Spa Treatments*

We offer natural, restorative treatments in a safe and serene environment:

🌿 *Professional Waxing*
From precise eyebrow shaping to full-body treatments, done with care and comfort

🤲 *Therapeutic Massages*  
Choose from Swedish, deep tissue, or our signature healing massage blend

👣 *Reflexology Sessions*
Targeting key pressure points in your feet, hands, head, and neck to support inner balance

✨ Every visit starts with a one-on-one consultation, so we tailor each treatment to your body and needs.

We prioritize hygiene, comfort, and leaving you feeling truly renewed 🌸`,
  },

  order_info: {
    type: "text",
    text: `📋 *How to Place Your Order*

*Easy ordering process:*
1️⃣ Click on a Product Photo or Name for detailed information
2️⃣ Choose your specification and enter quantity  
3️⃣ Click 'Buy Now'
4️⃣ Enter delivery address and required details
5️⃣ Review your Order Details carefully
6️⃣ Click "Place Order" to proceed to payment

*Payment Options:*
💳 M-Pesa
💵 Cash (before or after delivery)

*Need help?*
📞 Call us: 0712 345 678
📧 Email: info@graecare.com

We're always happy to assist you! 💚`,
  },

  contact_info: {
    type: "text",
    text: `📞 *Contact GraeCare*

We'd love to hear from you! Have a question or need help?

📞 *Call us:* 0712 345 678
📧 *Email us:* info@graecare.com

🕒 *We're here to help with:*
• Product recommendations
• Health consultations  
• Order assistance
• Spa bookings
• General wellness questions

We're always happy to chat and assist you! 💚`,
  },
};

// Back to menu option
const backToMenuOption = {
  type: "interactive",
  interactive: {
    type: "button",
    body: {
      text: "Would you like to explore something else?",
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "main_menu",
            title: "🏠 Main Menu",
          },
        },
        {
          type: "reply",
          reply: {
            id: "contact_info",
            title: "📞 Contact Us",
          },
        },
        {
          type: "reply",
          reply: {
            id: "order_info",
            title: "🛒 How to Order",
          },
        },
      ],
    },
  },
};

// User state management
const userSessions = {};

// Message handling logic
async function handleMessage(phoneNumber, messageText, buttonId = null) {
  const userId = phoneNumber;

  // Initialize user session
  if (!userSessions[userId]) {
    userSessions[userId] = {
      messageCount: 0,
      preferredTopics: [],
      lastInteraction: Date.now(),
      lastMessageId: null,
    };
  }

  userSessions[userId].messageCount++;
  userSessions[userId].lastInteraction = Date.now();

  // Determine response based on button ID or message text
  let responseKey = buttonId
    ? buttonId.toLowerCase().replace(/[-\s]/g, "_")
    : null;

  if (!responseKey && messageText) {
    const text = messageText.toLowerCase();
    if (
      text.includes("hi") ||
      text.includes("hello") ||
      text.includes("hey") ||
      text.includes("start")
    ) {
      responseKey = "welcome";
    } else if (
      text.includes("menu") ||
      text.includes("help") ||
      text.includes("options")
    ) {
      responseKey = "main_menu";
    } else {
      responseKey = "welcome";
    }
  }

  console.log("🔍 Handling input:", {
    phoneNumber,
    messageText,
    buttonId,
    normalizedKey: responseKey,
  });

  // Handle different response types
  try {
    switch (responseKey) {
      case "welcome":
      case "main_menu":
        await sendWhatsAppMessage(userId, messageTemplates.welcome);
        break;

      case "health_concerns":
        await sendWhatsAppMessage(userId, messageTemplates.healthConcerns);
        break;

      case "shop_products":
        await sendWhatsAppMessage(userId, messageTemplates.shopProducts);
        break;

      case "spa_services":
        await sendWhatsAppMessage(userId, messageTemplates.spaServices);
        break;

      case "spa_treatments":
        await sendWhatsAppMessage(userId, detailedResponses.spa_treatments);
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "book_spa":
        await sendWhatsAppMessage(userId, {
          type: "text",
          text: `🌸 *Ready to book your spa session?*\n\nVisit our spa booking page:\n🔗 https://graecare.com/grae-care-spa/\n\nOr call us directly at 📞 0712 345 678\n\nWe'll help you choose the perfect treatment for your needs! 💚`,
        });
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "contact_spa":
        await sendWhatsAppMessage(userId, {
          type: "text",
          text: `📞 *Contact GraeCare Spa*\n\nFor any spa-related inquiries, please call us at:\n📞 0712 345 678\n\nWe're here to help you with bookings, treatments, and any questions you may have! 💚`,
        });
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "contact_info":
        await sendWhatsAppMessage(userId, detailedResponses.contact_info);
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "order_info":
        await sendWhatsAppMessage(userId, detailedResponses.order_info);
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "supplement_products":
        await sendWhatsAppMessage(userId, {
          type: "text",
          text: `💊 *Natural Supplements*\n\nExplore our range of carefully curated supplements:\n\n🔗 https://graecare.com/shop/\n\n*Popular supplements include:*\n• Sea Moss - for energy and skin health\n• Ashwagandha - for stress and hormones\n• Magnesium - for cramps and sleep\n• Red Clover - for reproductive health\n\nAll natural, organic, and GMO-free! 🌿`,
        });
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "specialized_kits":
        await sendWhatsAppMessage(userId, {
          type: "text",
          text: `📦 *Specialized Health Kits*\n\n*PCOS Support Kits:*\n• Insulin Resistance PCOS Kit - KShs 8,400\n• Adrenal PCOS Kit - KShs 6,100\n• Inflammatory PCOS Kit - KShs 6,750\n\n*Other Kits:*\n• Yeast Infection Bundle - KShs 4,200\n\nEach kit is specially formulated for targeted support 🎯\n\n🔗 Browse all: https://graecare.com/shop/`,
        });
        setTimeout(() => sendWhatsAppMessage(userId, backToMenuOption), 1000);
        break;

      case "pcos":
      case "period_pain":
      case "hormonal_acne":
      case "fibroids":
      case "yeast_infection":
      case "uti":
      case "weight_loss":
      case "vaginal_dryness":
      case "anaemia":
        if (!userSessions[userId].preferredTopics.includes(responseKey)) {
          userSessions[userId].preferredTopics.push(responseKey);
        }

        if (detailedResponses[responseKey]) {
          await sendWhatsAppMessage(userId, detailedResponses[responseKey]);
          setTimeout(() => {
            sendWhatsAppMessage(userId, backToMenuOption).catch(console.error);
          }, 2000);
        } else {
          console.warn(`⚠️ Missing detailed response for key: ${responseKey}`);
          await sendWhatsAppMessage(userId, {
            type: "text",
            text: `Oops, I'm still learning about *${responseKey}*. Please try another option or type *menu*.`,
          });
        }
        break;

      default:
        await sendWhatsAppMessage(userId, {
          type: "text",
          text: `🤖 Sorry, I didn't understand that. Please choose an option from the menu or type *menu* to begin.`,
        });
        setTimeout(() => {
          sendWhatsAppMessage(userId, backToMenuOption).catch(console.error);
        }, 1000);
    }
  } catch (error) {
    console.error("❌ Error in handleMessage:", error);
    await sendWhatsAppMessage(userId, {
      type: "text",
      text: "Oops! Something went wrong. Please try again later 🌿",
    });
  }
}

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }
});

// Webhook for receiving messages
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      body.entry.forEach((entry) => {
        entry.changes.forEach((change) => {
          if (change.field === "messages") {
            const messages = change.value.messages;
            if (messages) {
              messages.forEach(async (message) => {
                const phoneNumber = message.from;
                const messageId = message.id;

                // Avoid processing the same message twice
                if (userSessions[phoneNumber]?.lastMessageId === messageId) {
                  return;
                }

                if (userSessions[phoneNumber]) {
                  userSessions[phoneNumber].lastMessageId = messageId;
                }

                // Handle text messages
                if (message.text?.body) {
                  console.log(
                    `Received text from ${phoneNumber}: ${message.text.body}`
                  );
                  await handleMessage(phoneNumber, message.text.body);
                }

                // Handle interactive message responses (button clicks)
                if (message.interactive) {
                  let buttonId;
                  if (message.interactive.type === "button_reply") {
                    buttonId = message.interactive.button_reply.id;
                  } else if (message.interactive.type === "list_reply") {
                    buttonId = message.interactive.list_reply.id;
                  }

                  if (buttonId) {
                    console.log(
                      `Received button click from ${phoneNumber}: ${buttonId}`
                    );
                    await handleMessage(phoneNumber, "", buttonId);
                  }
                }
              });
            }
          }
        });
      });
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Grae Care WhatsApp Bot is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Grae Care WhatsApp webhook with interactive messages is listening on port ${PORT}`
  );
});

module.exports = app;
