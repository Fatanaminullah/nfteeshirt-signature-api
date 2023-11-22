const { countDownDays } = require('./config');

exports.getEndDate = (startTime) => {
  const future = new Date(startTime);
  future.setDate(future.getDate() + countDownDays);
  return future;
}