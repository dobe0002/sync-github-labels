/* eslint-disable no-console */
const _ = require('lodash');

const _logWithType = (messageString, level) => {
  switch (level) {
    case 'warn':
      console.warn(`** ${messageString} **`);
      break;
    case 'error':
      console.error(`!!! ${messageString} !!!`);
      break;
    case 'info':
      console.info(messageString);
      break;
    default:
      console.log(messageString);
      break;
  }
};

const log = (message, level = 'log') => {
  if (_.isArray(message)) {
    _.each(message, msg => _logWithType(msg, level));
  } else {
    _logWithType(message, level);
  }
};

module.exports = log;
