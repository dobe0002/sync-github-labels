// mocks console.log

let outputLogData = '';
let outputErrorData = '';
let outputWarnData = '';

const clear = () => {
  outputLogData = '';
  outputErrorData = '';
  outputWarnData = '';
};

const getLog = () => {
  return outputLogData;
};

const getError = () => {
  return outputErrorData;
};

const getWarn = () => {
  return outputWarnData;
};

const log = (...args) => {
  outputLogData += args;
  outputLogData = outputLogData.replace(/,/g, ' ');
};

const error = (...args) => {
  outputErrorData += args;
  outputErrorData = outputErrorData.replace(/,/g, ' ');
};

const warn = (...args) => {
  outputWarnData += args;
  outputWarnData = outputWarnData.replace(/,/g, ' ');
};

module.exports = { log, warn, error, clear, getLog, getError, getWarn };
