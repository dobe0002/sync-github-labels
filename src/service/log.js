/* eslint-disable prefer-spread */
/* eslint-disable no-console */

const _LOGSTARTERS = {
  warn: '*** ',
  log: '',
  error: '!!!!! '
};

const warn = (...args) => {
  const messages = Array.prototype.slice.call(args);
  messages.unshift(_LOGSTARTERS.warn);
  console.warn.apply(console, messages);
};
const log = (...args) => {
  const messages = Array.prototype.slice.call(args);
  messages.unshift(_LOGSTARTERS.log);
  console.log.apply(console, messages);
  // console.log.apply(console, args);
};

const error = (...args) => {
  const messages = Array.prototype.slice.call(args);
  messages.unshift(_LOGSTARTERS.error);
  console.error.apply(console, messages);
};

module.exports = { log, warn, error, _LOGSTARTERS };
