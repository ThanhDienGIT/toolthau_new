const { Telegraf } = require("telegraf");
const TokenStorage = require("./TokenStorage");

const storeData = new TokenStorage();

const send_GroupThau = async (strMess,status, url = "") => {
  const bot = new Telegraf(storeData.botIdGroupThau, {
    handlerTimeout: 600000,
  });

  if (status == 0) {
    await bot.telegram
      .sendMessage(storeData.userIdPrivate, strMess)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  if (status == 1) {
    await bot.telegram.sendMessage(storeData.userIdPrivate, strMess, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Xem gói thầu", url }]],
      },
    });
  }
};

const send_Test = async (strMess, status, url = "") => {
  const bot = new Telegraf(storeData.botIdPrivate, {
    handlerTimeout: 600000,
  });

  if (status == 0) {
    await bot.telegram
      .sendMessage(storeData.userIdPrivate, strMess)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  if (status == 1) {
    await bot.telegram.sendMessage(storeData.userIdPrivate, strMess, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Xem gói thầu", url }]],
      },
    });
  }
};

module.exports = {
  send_GroupThau,
  send_Test,
};
