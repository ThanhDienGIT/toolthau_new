require("dotenv").config();

const { scheduleJob } = require("node-schedule");

const { runQuery, runSchedule, runScheduleNew } = require("./utils/main");
const { HELP } = require("./lib/str");

const { BOT_TOKEN, ADMIN_CHAT_ID, STR_SCHEDULES } = process.env;

const SCHEDULES = STR_SCHEDULES.split(",");
const { Telegraf } = require("telegraf");
const { sendKeyToGetFuntionFollowWant } = require("./DanhSachGoiThau/Main");
const { Func_ChiDinhTool } = require("./FuncMain/Main_Func");
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 600000 });


SCHEDULES.forEach((SCHEDULE) => {
  scheduleJob(SCHEDULE, () => Func_ChiDinhTool(0));
});

console.clear();
console.log("launch bot");
bot.launch();


