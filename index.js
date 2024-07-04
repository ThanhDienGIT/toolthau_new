require("dotenv").config();

const { scheduleJob } = require("node-schedule");

const { runQuery, runSchedule, runScheduleNew } = require("./utils/main");
const { HELP } = require("./lib/str");

const { BOT_TOKEN, ADMIN_CHAT_ID, STR_SCHEDULES } = process.env;

const SCHEDULES = STR_SCHEDULES.split(",");
const { Telegraf } = require("telegraf");
const { sendKeyToGetFuntionFollowWant } = require("./DanhSachGoiThau/Main");
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 600000 });

//group chat -449294338
//bot token 1935152100:AAEauOpcjdoDJujAK2da3zj-D1GCpPHISGM



// bot.help((ctx) => ctx.replyWithMarkdown(HELP));
// bot.command("update", (ctx) => bot.telegram.sendMessage(ADMIN_CHAT_ID, JSON.stringify(ctx.update)));
// bot.command("schedule", (ctx) => runSchedule(bot));
// bot.on("text", (_ctx) => runQuery(_ctx, bot));

console.log('run senKeys')
sendKeyToGetFuntionFollowWant('GETDANHSACH')

// SCHEDULES.forEach((SCHEDULE) => {
//   scheduleJob(SCHEDULE, () => sendKeyToGetFuntionFollowWant('GETDANHSACH'));
// });

// console.clear();
// console.log("launch bot");
// bot.launch();


