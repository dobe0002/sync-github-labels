/* eslint-disable prefer-spread */
/* eslint-disable no-console */

const _ = require('lodash');

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

const _formatReport = (repo, type) => {
  const method = {
    add: {
      text: 'Added',
      method: 'labelsAdded'
    },
    edit: {
      text: 'Edited',
      method: 'labelsEdited'
    },
    remove: {
      text: 'Removed',
      method: 'labelsRemoved'
    }
  };
  console.log(`+++++ Labels ${method[type].text} +++++`);
  _.each(repo[method[type]], label => {
    const errorText = label.error
      ? `${_LOGSTARTERS.error} Error syncing: `
      : '';

    const inuseText =
      type === 'remove' && label.inuse === true && label.removed === false
        ? `${_LOGSTARTERS.warn} Not removed because in use: `
        : '';
    console.log(`${errorText}${inuseText}${label.label.name}`);
    console.log(' ');
  });
};

const report = repo => {
  console.log('*******************************************');
  console.log('REPO: ', `${repo.owner}/${repo.name}`);
  console.log(' ');
  _formatReport(repo, 'add');
  _formatReport(repo, 'edit');
  _formatReport(repo, 'remove');
};

module.exports = { log, warn, error, report, _LOGSTARTERS };
