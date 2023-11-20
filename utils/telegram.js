const { GROUP_CHAT_ID, ADMIN_CHAT_ID } = process.env;
const { objData } = require("../lib/typedef");
const { checkThauExists, insertThau } = require("../database/dulieu_thau");
const { format, parseISO } = require("date-fns");
const { DATE_TIME_FORMAT } = require("../lib/str");
// const KEYWORDS = STR_KEYWORDS.split(",");

/**
 * @param {objData} data
 * @returns {string}
 */
const generateStrMessage = (data) => {
  const hinhThuc = data.isInternet ? "Qua mạng" : "Trực tiếp";
  const thoiDiemDang = format(parseISO(data.publicDate), DATE_TIME_FORMAT);
  const hanBanHSMT = format(parseISO(data.bidCloseDate), DATE_TIME_FORMAT);

  let strMessage = `Số TBMT: *${data.notifyNo}*`;
  strMessage += data.bidName.toString() ? `\nTên: *${data.bidName.toString().toUpperCase()}*` : "";
  strMessage += data.procuringEntityName ? `\nBên mời thầu: ${data.procuringEntityName}` : "";
  strMessage += data.investorName ? `\nNhà đầu tư: ${data.investorName}` : "";
  strMessage += `\nHình thức: ${hinhThuc}`;
  strMessage += `\nThời điểm đăng: *${thoiDiemDang}*`;
  strMessage += `\nHạn bán HSMT: *${hanBanHSMT}*`;
  return strMessage;
};

/**
 * @param {objData} data
 * @returns {string}
 */
const generateUrl = (data) => {
  let url = `https://muasamcong.mpi.gov.vn/web/guest/contractor-selection`;
  url += `?p_p_id=egpportalcontractorselectionv2_WAR_egpportalcontractorselectionv2`;
  url += `&p_p_lifecycle=0`;
  url += `&p_p_state=normal`;
  url += `&p_p_mode=view`;
  url += `&_egpportalcontractorselectionv2_WAR_egpportalcontractorselectionv2_render=detail`;
  url += `&type=es-notify-contractor`;
  url += `&stepCode=notify-contractor-step-1-tbmt`;
  url += `&id=${data.id}`;
  url += `&notifyId=${data.notifyId}`;
  url += `&inputResultId=undefined`;
  url += `&bidOpenId=undefined`;
  url += `&techReqId=undefined`;
  url += `&bidPreNotifyResultId=undefined`;
  url += `&bidPreOpenId=undefined`;
  url += `&processApply=${data.processApply}`;
  url += `&bidMode=${data.bidMode}`;
  url += `&notifyNo=${data.notifyNo}`;
  url += `&planNo=${data.planNo}`;
  url += `&pno=undefined`;

  return url;
};

/**
 * Gởi tin nhắn thông tin thầu cho người dùng khi thực hiện tra cứu qua telegram
 * @param {Context} ctx Context telegram
 * @param {objData} data Dữ liệu thầu
 * @returns {boolean} Kết quả gởi tin nhắn thành công hay không
 */
const sendMessageQuery = async (ctx, data) => {
  const strMessage = generateStrMessage(data);
  const url = generateUrl(data);

  await ctx.replyWithMarkdown(strMessage, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[{ text: "Xem gói thầu", url }]],
    },
  });
};

/**
 * Gởi tin nhắn thông tin thầu cho người dùng theo lịch
 * @param {Telegraf} bot Bot telegram
 * @param {objData} data Dữ liệu thầu
 * @returns {boolean} Kết quả gởi tin nhắn thành công hay không
 */
const sendMessageSchedule = async (bot, data) => {
  const strMessage = generateStrMessage(data);
  const url = generateUrl(data);

  const exists = await checkThauExists(data.notifyNo);
  if (!exists) {
    await bot.telegram.sendMessage(GROUP_CHAT_ID, strMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Xem gói thầu", url }]],
      },
    });
    insertThau(data.notifyNo);
  }
};

/**
 * Gởi tin nhắn thông tin thầu cho người dùng theo lịch
 * @param {Telegraf} bot Bot telegram
 * @param {int} countData Tổng số lượng gói thầu
 * @param {int} countSuccess Dữ liệu thầu
 * @returns {boolean} Kết quả gởi tin nhắn thành công hay không
 */
const reportAdmin = async (bot, countData, countSuccess, ctx = null) => {
  let strMessage = `Đã gởi *${countSuccess} / ${countData}* gói thầu`;

  if (ctx) {
    let message = ctx.update.message.text.trim();
    let { first_name, last_name } = ctx.update.message.from;

    strMessage = `${message}\n${strMessage}`;
    strMessage = `*${first_name} ${last_name}*\n${strMessage}`;
  } else {
    strMessage = `*Tìm theo lịch*\n${strMessage}`;
  }

  bot.telegram.sendMessage(ADMIN_CHAT_ID, strMessage, { parse_mode: "Markdown" });
};

/**
 * @param {Telegraf} bot Bot telegram
 */
const reportGroupNoData = async (bot) => bot.telegram.sendMessage(GROUP_CHAT_ID, "Hiện tại không có gói thầu mới");

module.exports = {
  generateStrMessage,
  generateUrl,
  sendMessageQuery,
  sendMessageSchedule,
  reportAdmin,
  reportGroupNoData,
};
