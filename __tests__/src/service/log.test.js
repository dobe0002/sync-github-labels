/* eslint-disable no-console */
const log = require('../../../src/service/log');
const Repo = require('../../../src/models/Repo');
const Label = require('../../../src/models/Label');
const mockLog = require('../../../src/service/mockLog');

describe('log tests', () => {
  console.log = jest.fn(mockLog.log);
  console.error = jest.fn(mockLog.error);
  console.warn = jest.fn(mockLog.warn);

  beforeEach(() => {
    console.error.mockClear();
    console.log.mockClear();
    console.warn.mockClear();
    mockLog.clear();
  });

  test('Logs level log with correctly', () => {
    log.log('hello', 'world');
    expect(console.log).toHaveBeenCalled();
    expect(mockLog.getLog()).toEqual(`${log._LOGSTARTERS.log} hello world`);
  });
  test('Logs level error with correctly', () => {
    log.error('hello', 'world');
    expect(console.error).toHaveBeenCalled();
    expect(mockLog.getError()).toEqual(`${log._LOGSTARTERS.error} hello world`);
  });
  test('Logs level warn with correctly', () => {
    log.warn('hello', 'world');
    expect(console.warn).toHaveBeenCalled();
    expect(mockLog.getWarn()).toEqual(`${log._LOGSTARTERS.warn} hello world`);
  });
  test('Debug statements do not show if debug is set to false', () => {
    log.debug(false, 'you should not see me');
    expect(console.log).not.toHaveBeenCalled();
  });
  test('Debug statements show if debug is set to true', () => {
    log.debug(true, 'you should see me');
    expect(console.log).toHaveBeenCalled();
    expect(mockLog.getLog()).toEqual(
      `${log._LOGSTARTERS.debug} you should see me`
    );
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
      '*******************************************REPO: myOrg/myRepo +++++ Labels Added +++++ +++++ Labels Edited +++++ +++++ Labels Removed +++++Good_LabelInuse_Label ***  Not removed because in use !!!!!  Error syncing: Error_Label  +++++ Labels Updated +++++ ';

    log.report(repo);
    expect(console.log).toHaveBeenCalled();
    expect(mockLog.getLog()).toEqual(expected);
  });
});
