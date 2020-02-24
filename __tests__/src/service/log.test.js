/* eslint-disable no-console */
const log = require('../../../src/service/log');
const Repo = require('../../../src/models/Repo');
const Label = require('../../../src/models/Label');

describe('log tests', () => {
  // mocks console.log
  let outputLogData = '';
  const storeLog = (...args) => {
    outputLogData += args;
    outputLogData = outputLogData.replace(/,/g, ' ');
  };
  console.log = jest.fn(storeLog);

  // mocks console.error
  let outputErrorData = '';
  const storeError = (...args) => {
    outputErrorData += args;
    outputErrorData = outputErrorData.replace(/,/g, ' ');
  };
  console.error = jest.fn(storeError);

  // mocks console.warn
  let outputWarnData = '';
  const storeWarn = (...args) => {
    outputWarnData += args;
    outputWarnData = outputWarnData.replace(/,/g, ' ');
  };
  console.warn = jest.fn(storeWarn);

  beforeEach(() => {
    outputErrorData = '';
    outputLogData = '';
    outputWarnData = '';

    console.error.mockClear();
    console.log.mockClear();
    console.warn.mockClear();
  });

  test('Logs level log with correctly', () => {
    log.log('hello', 'world');
    expect(console.log).toHaveBeenCalled();
    expect(outputLogData).toEqual(`${log._LOGSTARTERS.log} hello world`);
  });
  test('Logs level error with correctly', () => {
    log.error('hello', 'world');
    expect(console.error).toHaveBeenCalled();
    expect(outputErrorData).toEqual(`${log._LOGSTARTERS.error} hello world`);
  });
  test('Logs level warn with correctly', () => {
    log.warn('hello', 'world');
    expect(console.warn).toHaveBeenCalled();
    expect(outputWarnData).toEqual(`${log._LOGSTARTERS.warn} hello world`);
  });
  test('Debug statements do not show if debug is set to false', () => {
    log.debug(false, 'you should not see me');
    expect(console.log).not.toHaveBeenCalled();
  });
  test('Debug statements show if debug is set to true', () => {
    log.debug(true, 'you should see me');
    expect(console.log).toHaveBeenCalled();
    expect(outputLogData).toEqual(`${log._LOGSTARTERS.log} you should see me`);
  });

  test('Creates proper end of run report for a given repo', () => {
    const repo = new Repo({ owner: { login: 'myOrg' }, name: 'myRepo' });
    repo.labelRemoved(new Label({ name: 'Good_Label' }), null, false, true); // good removal
    repo.labelRemoved(new Label({ name: 'Inuse_Label' }), null, true, false); // not removed due to inuse
    repo.labelRemoved(
      new Label({ name: 'Error_Label ' }),
      'Error text that should not show',
      false,
      false
    ); // error with removing

    const expected =
      '*******************************************REPO: myOrg/myRepo +++++ Labels Added +++++ +++++ Labels Edited +++++ +++++ Labels Removed +++++Good_LabelInuse_Label ***  Not removed because in use !!!!!  Error syncing: Error_Label  ';

    log.report(repo);
    expect(console.log).toHaveBeenCalled();
    expect(outputLogData).toEqual(expected);
  });
});
