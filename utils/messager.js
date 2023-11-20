const dateFns = require("date-fns");
const { objResultMessageHandle } = require("../lib/typedef");
const { getStartDate, getEndDate } = require("./dateTime");
const {
  DATE_FORMAT,
  STARTDATE_INVALID,
  ENDDATE_INVALID,
  STARTDATE_GREATERTHAN_ENDDATE,
  DATE_INVALID,
} = require("../lib/str");

/**
 * @param {string} _message Tin nhắn
 * @returns {objResultMessageHandle}
 */
const handleMessage = (_message) => {
  // ? Bỏ qua nếu nội dung tin nhắn bắt đầu bằng ký tự
  if (!_message.match(/^\d/))
    return {
      ok: false,
      log: null,
      startDate: null,
      endDate: null,
    };

  let isRange =
    _message.split("-").length !== 1 && _message.length > 20 ? true : false;

  if (isRange) {
    let range = _message.split(" ")[0];
    let startDate = range.split("-")[0].trim();
    let endDate = range.split("-")[1].trim();

    if (!dateFns.isMatch(startDate, DATE_FORMAT)) {
      return {
        ok: false,
        log: STARTDATE_INVALID,
        from: null,
        to: null,
      };
    }
    if (!dateFns.isMatch(endDate, DATE_FORMAT)) {
      return {
        ok: false,
        log: ENDDATE_INVALID,
        from: null,
        to: null,
      };
    }

    let _startDate = dateFns.parse(startDate, DATE_FORMAT, new Date());
    let _endDate = dateFns.parse(endDate, DATE_FORMAT, new Date());

    if (dateFns.compareAsc(_startDate, _endDate) == 1) {
      return {
        ok: false,
        log: STARTDATE_GREATERTHAN_ENDDATE,
        from: null,
        to: null,
      };
    }

    let from = getStartDate(_startDate);
    let to = getEndDate(_endDate);

    return {
      ok: true,
      log: `Tìm dữ liệu từ ${startDate} đến ${endDate} ...`,
      from,
      to,
    };
  } else {
    let date = _message.split(" ")[0];
    if (!dateFns.isMatch(date, DATE_FORMAT)) {
      return {
        ok: false,
        log: DATE_INVALID,
        from: null,
        to: null,
      };
    }

    let _date = dateFns.parse(date, DATE_FORMAT, new Date());
    let from = getStartDate(_date);
    let to = getEndDate(_date);

    return {
      ok: true,
      log: `Tìm dữ liệu ngày ${date} ...`,
      from,
      to,
    };
  }
};

module.exports = { handleMessage };
