/* eslint-disable no-console */
const log = require('../../../src/service/log');
const Repo = require('../../../src/models/Repo');

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
  test('Creates a proper end of run report', () => {
    // TODO this is a dummy test, it needs to check with the  actual console.log
    // The console.log mock is running all statements into a single line:
    // *******************************************REPO:  / +++++ Labels Added ++++++++++ Labels Edited ++++++++++ Labels Removed +++++
    const repo = new Repo();
    log.report(repo);
    expect(console.log).toHaveBeenCalled();
  });
});
