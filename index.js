require("dotenv").config();

const { scheduleJob } = require("node-schedule");

const { runQuery, runSchedule, runScheduleNew } = require("./utils/main");
const { HELP } = require("./lib/str");

const { BOT_TOKEN, ADMIN_CHAT_ID, STR_SCHEDULES } = process.env;

const SCHEDULES = STR_SCHEDULES.split(",");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 600000 });


// bot.help((ctx) => ctx.replyWithMarkdown(HELP));
// bot.command("update", (ctx) => bot.telegram.sendMessage(ADMIN_CHAT_ID, JSON.stringify(ctx.update)));
// bot.command("schedule", (ctx) => runSchedule(bot));
// bot.on("text", (_ctx) => runQuery(_ctx, bot));

SCHEDULES.forEach((SCHEDULE) => {
  scheduleJob(SCHEDULE, () => runScheduleNew(bot));
});

runScheduleNew(bot)

console.clear();
console.log("launch bot");
bot.launch();


