const { subDays, addDays, format } = require("date-fns");

const getStartDate = (_input) => {
  return format(_input, "yyyy-MM-dd") + "T00:00:00.000Z";
};
const getEndDate = (_input) => {
  return format(_input, "yyyy-MM-dd") + "T23:59:59.000Z";
};
/**
 * @param {bool} _startEnd true là đầu ngày, false là cuối ngày
 */
const getToday = (_startEnd) => {
  if (_startEnd) return getStartDate(new Date());
  else return getEndDate(new Date());
};
/**
 * @param {number} _amount Số ngày cộng thêm
 * @param {bool} _startEnd true là đầu ngày, false là cuối ngày
 */
const getNext = (_amount, _startEnd) => {
  if (_startEnd) return getStartDate(addDays(new Date(), _amount));
  else return getEndDate(addDays(new Date(), _amount));
};
/**
 * @param {number} _amount Số ngày trừ đi
 * @param {bool} _startEnd true là đầu ngày, false là cuối ngày
 */
const getPrev = (_amount, _startEnd) => {
  if (_startEnd) return getStartDate(subDays(new Date(), _amount));
  else return getEndDate(subDays(new Date(), _amount));
};

module.exports = { getToday, getNext, getPrev, getStartDate, getEndDate };
