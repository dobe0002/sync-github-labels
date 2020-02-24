import SyncOptions from '../../../src/models/SyncOptions';
import log from '../../../src/service/log';

describe('Sync Options Model tests', () => {
  let syncOptions = {};
  let inputFromCLI = {};
  let outputLogData = '';
  const storeLog = (...args) => {
    outputLogData += args;
    outputLogData = outputLogData.replace(/,/g, ' ');
  };
  log.log = jest.fn(storeLog);
  beforeEach(() => {
    inputFromCLI = {
      inputFile: 'myInputFile',
      github: 'myGitHub'
    };
    syncOptions = new SyncOptions(inputFromCLI);
  });
  test('Is instance of SyncOptions', () => {
    expect(syncOptions).toBeInstanceOf(SyncOptions);
  });
  test('Getters, no config file', () => {
    expect(syncOptions.inputFile).toEqual('myInputFile');
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.github).toEqual('myGitHub');
    expect(syncOptions.token).toBeFalsy();
  });
  test('Getters, with config file', () => {
    inputFromCLI.config = '__fixtures__/config.json';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.inputFile).toEqual('MyNewInputFile');
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.github).toEqual('myGitHub');
    expect(syncOptions.token).toEqual('MyGitHubToken');
  });
  test('Cannot find config file', () => {
    inputFromCLI.config = '__fixtures__/cannotFindMe.json';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(log.log).toHaveBeenCalled();
  });
  test('Has required - pass', () => {
    inputFromCLI.token = 'myToken';
    inputFromCLI.outputRepoFile = 'myOutputFile';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.token).toBeTruthy();
    expect(syncOptions.hasRequired()).toBeTruthy();
  });
  test('Has Required  with missing input File and input repo - fail', () => {
    inputFromCLI = {
      github: 'myGitHub',
      token: 'mytoken',
      outputRepos: ['myrepo']
    };
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.syncInputRepo).toBeFalsy();
    expect(syncOptions.hasRequired()).toBeFalsy();
  });
  test('Has Required  with missing github token - fail', () => {
    inputFromCLI = {
      inputFile: 'myInputFile',
      github: 'myGithubRepo',
      outputRepos: ['myrepo']
    };
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.token).toBeFalsy();
    expect(syncOptions.hasRequired()).toBeFalsy();
  });
  test('Has Required  with missing github url - fail', () => {
    inputFromCLI = {
      inputFile: 'myInputFile',
      token: 'myToken',
      outputRepos: ['myrepo']
    };
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.github).toBeFalsy();
    expect(syncOptions.hasRequired()).toBeFalsy();
  });
  test('Has Required  with missing output repo - fail', () => {
    inputFromCLI = {
      inputFile: 'myInputFile',
      github: 'myGitHubUrl',
      token: 'myToken'
    };
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.outputRepos).toHaveLength(0);
    expect(syncOptions.outputFile).toBeFalsy();
    expect(syncOptions.hasRequired()).toBeFalsy();
  });
});
