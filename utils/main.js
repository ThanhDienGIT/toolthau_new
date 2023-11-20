require("dotenv").config();
const colors = require("colors");
const { Telegraf, Context } = require("telegraf");
const { objData } = require("../lib/typedef");
const str = require("../lib/str");
const { handleMessage } = require("./messager");
const { getData, getData_v2 } = require("./api");
const { sendMessageQuery, sendMessageSchedule, reportAdmin, reportGroupNoData } = require("./telegram");
const { getToday, getPrev } = require("./dateTime");
const { GROUP_CHAT_ID, ADMIN_CHAT_ID } = process.env;
const { CONFIG_DELAY_MESSAGE, CONFIG_RETRY_TIME, CONFIG_REPORT_GROUP_NODATA } = process.env;
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const crawData = require('../DrawData');
const { checkThauExists, insertThau } = require('../database/dulieu_thau');
const { Driver } = require("selenium-webdriver/chrome");
// const KEYWORDS = STR_KEYWORDS.split(",");
/**
 * Check if data match keyword
 * @param {Array.<objData>} data
 * @returns
 */
// const verifyData = (data) => {
//   if (data.locations) {
//     for (const location of data.locations) {
//       if (location.provName.toLowerCase().includes(STR_PROVINCE.trim())) {
//         return true;
//       }
//     }
//   } else {
//     for (const KEYWORD of KEYWORDS) {
//       if (
//         data.bidName.toLowerCase().includes(KEYWORD.trim()) ||
//         data.investorName.toLowerCase().includes(KEYWORD.trim())
//       ) {
//         return true;
//       }
//     }
//   }
//   return false;
// };

/**
 * @param {string} _from Datetime in ISO string
 * @param {string} _to Datetime in ISO string
 * @returns {Array.<objData>}
 */
const getAllData = async (_from, _to) => {
  let arrData = [];

  let pageSize = 10;
  let pageNumber = 0;
  do {
    var datas = await getData_v2(_from, _to, pageSize, pageNumber++);
    var page = datas.page.content;

    // Hàm getData_v2 đã tìm theo provCode nên không cần verifyData
    for (const data of page) {
      // verifyData(data) && arrData.push(data);
      arrData.push(data);
    }
  } while (page.totalPages > page.currentPage + 1);

  console.log(`Tìm thấy ${arrData.length} gói thầu`);
  return arrData;
};

/**
 * @param {Context} _ctx
 */
const runQuery = async (_ctx, bot) => {
  let message = _ctx.update.message.text.trim();
  let { first_name, last_name, username } = _ctx.update.message.from;

  console.log(
    colors.white.bgMagenta(
      new Date().toLocaleString(),
      `User: ${username || ""}`,
      `Tên: ${first_name || ""} ${last_name || ""}`,
      `Message: ${message}`
    )
  );

  let result = handleMessage(message);
  result.log && _ctx.replyWithMarkdown(result.log);
  result.log && console.log(result.log);
  !result.ok && _ctx.replyWithMarkdown(str.HELP);

  if (result.ok) {
    const arrData = await getAllData(result.from, result.to);

    let countSentMessage = 0;
    for await (const data of arrData) {
      let countRetry = 0;
      let sent = false;

      do {
        try {
          await sendMessageQuery(_ctx, data);
          countSentMessage++;
          sent = true;
        } catch (error) {
          if (error.response.error_code === 429) {
            console.log(data.notifyNo, error.response.description);
            const retryAfter = (error.response.parameters.retry_after || 1) * 1000;
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
          } else {
            console.log(error);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, CONFIG_DELAY_MESSAGE));
      } while (!sent && ++countRetry < CONFIG_RETRY_TIME);
    }

    !!!countSentMessage && _ctx.reply("Không có dữ liệu");
    console.log(`Đã gởi ${countSentMessage} gói thầu`);
    reportAdmin(bot, arrData.length, countSentMessage, _ctx);
  }
};

/**
 * @param {Telegraf} bot
 */

const runScheduleNew = async (bot) => {
  try {
    const arrRender = await crawData();
    var CoThau = true
    for (let element of arrRender) {
      if (await checkThauExists(element.TBMT.slice(9, 21)) === true) {
      }
      else {
        let strMessage = `Số TBMT: *${element.TBMT.slice(9, 21)}* \n`;
        strMessage += `Tên: *${element.name.toString().toUpperCase()}* \n`;
        strMessage += `Bên mời thầu: ${element.benmoithau} \n`;
        strMessage += `Nhà đầu tư: ${element.nhadautu} \n`;
        strMessage += `Hình thức: ${element.hinhthuc} \n`;
        strMessage += `Thời điểm đăng: *${element.thoidiemdang}* \n`;
        strMessage += `Hạn bán HSMT: *${element.hanban}* \n`;
        url = element.url
        await bot.telegram.sendMessage(GROUP_CHAT_ID, strMessage, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "Xem gói thầu", url }]],
          },
        });
        insertThau(element.TBMT.slice(9, 21));
        CoThau = false
        console.log('Gói thầu mới : ' + element.TBMT.slice(9, 21))
      }
    }
    if(CoThau){
      bot.telegram.sendMessage(GROUP_CHAT_ID, "Không có gói thầu nào mới")
    }
  } catch (error) {
    console.error('craw Failed:', error);
    console.log('Đang chạy lại tool')
  } finally {
    console.log('DONE!!')
  }
}

const runSchedule = async (bot) => {
  console.log(colors.white.bgMagenta(new Date().toLocaleString(), "Tìm gói thầu theo lịch"));
  let from = getPrev(1, true);
  let to = getToday(false);

  const arrData = await getAllData(from, to);

  let countSentMessage = 0;
  for await (const data of arrData) {
    let countRetry = 0;
    let sent = false;

    do {
      try {
        await sendMessageSchedule(bot, data);
        countSentMessage++;
        sent = true;
      } catch (error) {
        console.log(error);
        if (error.response.error_code === 429) {
          console.log(data.notifyNo, error.response.description);
          const retryAfter = (error.response.parameters.retry_after || 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, retryAfter));
        }
      }
      await new Promise((resolve) => setTimeout(resolve, CONFIG_DELAY_MESSAGE));
    } while (!sent && ++countRetry < CONFIG_RETRY_TIME);
  }

  console.log(`Đã gởi ${countSentMessage} gói thầu`);
  countSentMessage === 0 && CONFIG_REPORT_GROUP_NODATA === "true" && reportGroupNoData(bot);
  reportAdmin(bot, arrData.length, countSentMessage);
};

module.exports = { getAllData, runQuery, runSchedule, runScheduleNew };
