require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// In-memory DB (replace with MongoDB later)
const users = {};

// 🔰 START
bot.onText(/\/start(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!users[userId]) {
    users[userId] = { coins: 50, referrals: 0 };
  }

  bot.sendMessage(chatId,
    `🚀 Welcome to ToolHub Bot

⚡ All-in-one tools:
📥 Download videos
🖼️ Edit images
📄 PDF tools
🤖 AI tools
💸 Earn rewards

👇 Choose an option below`,
    mainMenu()
  );
});

// 🏠 MAIN MENU
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📥 Download Tools", callback_data: "download_tools" },{ text: "🖼️ Image Tools", callback_data: "image_tools" }],
        [{ text: "📄 PDF Tools", callback_data: "pdf_tools" },{ text: "🤖 AI Tools", callback_data: "ai_tools" }],
        [{ text: "👤 Profile", callback_data: "profile" }]
      ]
    }
  };
}

// 🔘 BUTTON HANDLER
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  // 📥 DOWNLOAD TOOLS
  if (data === "download_tools") {
    bot.sendMessage(chatId, "📥 Choose platform:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Instagram", callback_data: "dl_instagram" }],
          [{ text: "YouTube", callback_data: "dl_youtube" }],
          [{ text: "⬅️ Back", callback_data: "back_home" }]
        ]
      }
    });
  }

  else if (data === "dl_instagram") {
    bot.sendMessage(chatId, "📸 Send Instagram link");
  }

  else if (data === "dl_youtube") {
    bot.sendMessage(chatId, "▶️ Send YouTube link");
  }

  // 🖼️ IMAGE TOOLS
  else if (data === "image_tools") {
    bot.sendMessage(chatId, "🖼️ Image Tools:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Remove Background", callback_data: "img_remove_bg" }],
          [{ text: "⬅️ Back", callback_data: "back_home" }]
        ]
      }
    });
  }

  else if (data === "img_remove_bg") {
    bot.sendMessage(chatId, "🖼️ Send image to remove background");
  }

  // 📄 PDF TOOLS
  else if (data === "pdf_tools") {
    bot.sendMessage(chatId, "📄 PDF Tools:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Merge PDF", callback_data: "pdf_merge" }],
          [{ text: "⬅️ Back", callback_data: "back_home" }]
        ]
      }
    });
  }

  // 🤖 AI TOOLS
  else if (data === "ai_tools") {
    bot.sendMessage(chatId, "🤖 AI Tools:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Text Generator", callback_data: "ai_text" }],
          [{ text: "⬅️ Back", callback_data: "back_home" }]
        ]
      }
    });
  }

  else if (data === "ai_text") {
    bot.sendMessage(chatId, "✍️ Send your topic");
  }

  // 👤 PROFILE
  else if (data === "profile") {
    const user = users[userId];
    bot.sendMessage(chatId,
      `👤 Profile

🆔 ID: ${userId}
💰 Coins: ${user.coins}
👥 Referrals: ${user.referrals}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "back_home" }]
          ]
        }
      }
    );
  }

  // BACK
  else if (data === "back_home") {
    bot.sendMessage(chatId, "🏠 Main Menu", mainMenu());
  }
});

// 📩 HANDLE USER INPUT (basic)
bot.on("message", (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "⚡ Processing... (connect API here)");
});
