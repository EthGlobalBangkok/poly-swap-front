const { Telegraf } = require("telegraf");
const jwt = require("jsonwebtoken");
const nodeCrypto = require("crypto");
require('dotenv').config();

// Environment variables
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const LOGIN_URL = process.env.LOGIN_URL;

if (!TOKEN || !LOGIN_URL) {
  console.error(
    "Please add your Telegram bot token and app URL to the .env file"
  );
  process.exit(1);
}

// Initialize the bot
const bot = new Telegraf(TOKEN);

// Regular expression for validating a Telegram handle
const handleRegex = /^@[a-zA-Z0-9_]{5,}$/;

// State storage to keep track of users' responses
const userState: { [key: number]: { stage: string; receiver?: string; amount?: number; chain?: string } } = {};

bot.start((ctx: any) => {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open",
            web_app: {
              url: `${LOGIN_URL}/?telegramAuthToken=${generateTelegramAuthToken(ctx)}&page=welcome`,
            },
          },
        ],
      ],
    },
  };

  ctx.reply("Welcome to MiniSafe 🍏", keyboard);
});

// Start command handling for the bot
bot.command("menu", ((ctx: any) => {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Apps 📲",
            web_app: {
              url: `${LOGIN_URL}/?telegramAuthToken=${generateTelegramAuthToken(ctx)}&page=apps`,
            },
          },
          {
            text: "Wallet 💵",
            web_app: {
              url: `${LOGIN_URL}/?telegramAuthToken=${generateTelegramAuthToken(ctx)}&page=wallet`,
            },
          },
        ],
        [
          {
            text: "Swap 📈",
            web_app: {
              url: `${LOGIN_URL}/?telegramAuthToken=${generateTelegramAuthToken(ctx)}&page=swap`,
            },
          },
          {
            text: "Send 📤",
            callback_data: "send_money",
          },
        ],
      ],
    },
  };

  ctx.reply("Select an action with Mini Safe 🔥", keyboard);
}));

// Handle "Send 📤" action
bot.action("send_money", (ctx: any) => {
  userState[ctx.chat.id] = { stage: 'waiting_for_receiver' }; // Set initial stage
  ctx.reply("Who do you want to send money to?");
});

// Handle text messages based on the user's stage
bot.on("text", (ctx: any) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;

  // Check the stage of the conversation
  const currentStage = userState[chatId]?.stage;

  if (currentStage === 'waiting_for_receiver') {
    // Validate the Telegram handle
    if (handleRegex.test(text)) {
      userState[chatId] = { ...userState[chatId], receiver: text, stage: 'waiting_for_amount' };
      ctx.reply("How much would you like to send? ($USD)");
    } else {
      ctx.reply("Incorrect Telegram handle. Who do you want to send money to?");
    }
  } else if (currentStage === 'waiting_for_amount') {
    // Validate the amount (only numbers)
    const amount = parseFloat(text);
    if (!isNaN(amount) && amount > 0) {
      userState[chatId] = { ...userState[chatId], amount, stage: 'waiting_for_chain' };

      // Provide blockchain options
      ctx.reply("From which chain?", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Ethereum", callback_data: "ethereum" }],
            [{ text: "Linea", callback_data: "linea" }],
            [{ text: "Gnosis", callback_data: "gnosis" }],
            [{ text: "Optimism", callback_data: "optimism" }],
            [{ text: "Flow", callback_data: "flow" }],
            [{ text: "Rootstock", callback_data: "rootstock" }],
          ],
        },
      });
    } else {
      ctx.reply("Please enter a valid amount in USD.");
    }
  }
});

// Handle blockchain selection
bot.action(/^(ethereum|linea|gnosis|optimism|flow|rootstock)$/, (ctx: any) => {
  const chatId = ctx.chat.id;
  const chain = ctx.match[0]; // The selected chain

  // Store the selected chain in the state
  userState[chatId] = { ...userState[chatId], chain };

  const { receiver, amount } = userState[chatId];

  // Generate the transaction link and open the web app
  const sendLink = `${LOGIN_URL}/?telegramAuthToken=${generateTelegramAuthToken(ctx)}&page=send&to=${receiver}&amount=${amount}&chain=${chain}`;

  ctx.reply(`Sending ${amount} USD to ${receiver} on ${chain}. Proceed with the transaction:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Send Now", web_app: { url: sendLink } }],
      ],
    },
  });

  // Clear the state after the transaction is set up
  delete userState[chatId];
});

// Launch the bot
bot.launch();
console.log('[DEBUG] Bot script connected...');

// Helper function to generate a JWT token for Telegram authentication
function generateTelegramAuthToken(ctx: any) {
  const userData = {
    authDate: Math.floor(new Date().getTime()),
    firstName: ctx.update.message?.from.first_name || ctx.update.callback_query?.from.first_name,
    username: ctx.update.message?.from.username || ctx.update.callback_query?.from.username,
    id: ctx.update.message?.from.id || ctx.update.callback_query?.from.id,
  };

  const hash = generateTelegramHash(userData);

  return jwt.sign(
    {
      ...userData,
      hash,
    },
    TOKEN, // Use the bot token to sign the JWT
    { algorithm: "HS256" }
  );
}

// Function to generate HMAC hash for Telegram authentication
function generateTelegramHash(data: { authDate: number; firstName: string; id: number; username: string }) {
  const useData = {
    auth_date: String(data.authDate),
    first_name: data.firstName,
    id: String(data.id),
    username: data.username,
  };

  const dataCheckArr = Object.entries(useData)
    .map(([key, value]) => `${key}=${String(value)}`)
    .sort((a, b) => a.localeCompare(b))
    .join("\n");

  const TELEGRAM_SECRET = nodeCrypto.createHash("sha256").update(TOKEN).digest();

  return nodeCrypto.createHmac("sha256", TELEGRAM_SECRET).update(dataCheckArr).digest("hex");
}
