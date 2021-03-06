/* eslint-disable prefer-spread */
/* eslint-disable no-console */

const _ = require('lodash');

const _LOGSTARTERS = {
  warn: '*** ',
  log: '',
  error: '!!!!! ',
  debug: '~~~ '
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
};

const error = (...args) => {
  const messages = Array.prototype.slice.call(args);
  messages.unshift(_LOGSTARTERS.error);
  console.error.apply(console, messages);
};
const debug = (mode, ...args) => {
  if (mode === true) {
    const messages = Array.prototype.slice.call(args);
    messages.unshift(_LOGSTARTERS.debug);
    console.log.apply(console, messages);
  }
};

const _formatReport = (repo, type) => {
  const methods = {
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
    },
    update: {
      text: 'Updated',
      method: 'labelsUpdated'
    }
  };

  console.log(`+++++ Labels ${methods[type].text} +++++`);
  _.each(repo[methods[type].method], labelObj => {
    const errorText =
      labelObj.error !== null ? `${_LOGSTARTERS.error} Error syncing: ` : '';

    const inuseText =
      type === 'remove' && labelObj.inuse === true && labelObj.removed === false
        ? ` ${_LOGSTARTERS.warn} Not removed because in use `
        : '';
    let labelName = labelObj.label.name;
    if (labelObj.label.newName !== '') {
      labelName = `${labelObj.label.newName} (${labelObj.label.name})`;
    }
    console.log(`${errorText}${labelName}${inuseText}`);
  });
  console.log(' ');
};

const report = repo => {
  console.log('*******************************************');
  console.log('REPO:', `${repo.owner}/${repo.name}`);
  console.log(' ');
  _formatReport(repo, 'add');
  _formatReport(repo, 'edit');
  _formatReport(repo, 'remove');
  _formatReport(repo, 'update');
};

module.exports = { log, warn, error, debug, report, _LOGSTARTERS };
