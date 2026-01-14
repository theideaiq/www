import { Bot, session, type Context, type SessionFlavor } from "grammy";
import type { Content } from "@google/generative-ai";
import { env } from "../env";
import { UpstashAdapter } from "./storage";
import { redis } from "./redis";
import { generateResponse } from "./gemini";

interface SessionData {
  history: Content[];
}

export type MyContext = Context & SessionFlavor<SessionData>;

export const bot = new Bot<MyContext>(env.TELEGRAM_BOT_TOKEN ?? "mock");

function getSessionKey(ctx: Context): string | undefined {
  return ctx.from && ctx.chat ? `${ctx.chat.id}:${ctx.from.id}` : undefined;
}

// Session middleware
bot.use(session({
  initial: (): SessionData => ({ history: [] }),
  storage: new UpstashAdapter<SessionData>(redis),
  getSessionKey,
}));

// Group Logic: Welcome
bot.on("message:new_chat_members", async (ctx) => {
  await ctx.reply("Welcome to The IDEA Community!");
});

// Main Message Handler
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  const chatType = ctx.chat.type;

  // Group Logic: Spam
  if (chatType === "group" || chatType === "supergroup") {
    const lower = text.toLowerCase();
    const spamKeywords = ['crypto', 'bitcoin', 'btc', 'invest', 'forex', 'profit', 'binance'];

    if (spamKeywords.some(w => lower.includes(w))) {
       try {
         await ctx.deleteMessage();
       } catch (e) {
         // biome-ignore lint/suspicious/noConsole: logging errors is fine
         console.error("Failed to delete spam message:", e);
       }
    }
    return;
  }

  // Private Logic: AI Agent
  if (chatType === "private") {
    await ctx.replyWithChatAction("typing");

    const history = ctx.session.history || [];

    const reply = await generateResponse(history, text);

    await ctx.reply(reply);

    // Update history
    const newHistory = [
      ...history,
      { role: "user", parts: [{ text }] },
      { role: "model", parts: [{ text: reply }] }
    ];

    // Limit to last 20 messages
    ctx.session.history = newHistory.slice(-20) as Content[];
  }
});
