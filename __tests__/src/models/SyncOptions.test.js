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

  let outputErrorData = '';
  const storeError = (...args) => {
    outputErrorData += args;
    outputErrorData = outputErrorData.replace(/,/g, ' ');
  };
  log.error = jest.fn(storeError);
  beforeEach(() => {
    outputLogData = '';
    outputErrorData = '';
    inputFromCLI = {
      inputFile: 'myInputFile',
      github: 'myGitHub',
      outputRepoFile: 'myOutPutRepFilePath'
    };
    syncOptions = new SyncOptions(inputFromCLI);
  });
  test('Is instance of SyncOptions', () => {
    expect(syncOptions).toBeInstanceOf(SyncOptions);
  });
  test('Getters, no config file', () => {
    syncOptions._jsonConfig = '';
    syncOptions._jsConfig = '';

    expect(syncOptions.inputFile).toEqual('myInputFile');
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.github).toEqual('myGitHub');
    expect(syncOptions.token).toBeFalsy();

    expect(syncOptions.debug).toBeFalsy();
    expect(syncOptions.active).toBeFalsy();
    expect(syncOptions.outputRepoFile).toEqual('myOutPutRepFilePath');
    expect(syncOptions.sync).toBeFalsy();
    expect(syncOptions.force).toBeFalsy();
  });
  test('Getters, with config file', () => {
    inputFromCLI.config = '__fixtures__/config.json';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.inputFile).toEqual('MyNewInputFile');
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.github).toEqual('myGitHub');
    expect(syncOptions.token).toEqual('MyGitHubToken');

    expect(syncOptions.debug).toBeTruthy();
    expect(syncOptions.active).toBeTruthy();
    expect(syncOptions.outputRepoFile).toEqual('myOutPutRepFilePath'); // note this is pulled from inputFromCLI
    expect(syncOptions.sync).toBeTruthy();
    expect(syncOptions.force).toBeTruthy();
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

  test('Pull configs from a .js based config file', () => {
    inputFromCLI.config = '__fixtures__/config.js';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.inputFile).toEqual('MyNewInputFileFromJSConfig');
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.github).toEqual('myGitHub');
    expect(syncOptions.token).toEqual('MyNewInputFileFromJSConfig');

    expect(syncOptions.debug).toBeTruthy();
    expect(syncOptions.active).toBeTruthy();
    expect(syncOptions.outputRepoFile).toEqual('myOutPutRepFilePath'); // note this is pulled from inputFromCLI
    expect(syncOptions.sync).toBeTruthy();
    expect(syncOptions.force).toBeTruthy();
  });

  test('Cannot find config file', () => {
    inputFromCLI.config = '__fixtures__/cannotFindMe.json';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(log.error).toHaveBeenCalled();
    expect(outputErrorData).toEqual(
      'Unable to get config file __fixtures__/cannotFindMe.json'
    );
  });

  test('Log error when sent config file cannot be read', () => {
    inputFromCLI.config = '__fixtures__/bad.json';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(log.error).toHaveBeenCalled();
    expect(outputErrorData).toEqual(
      'Unable to get config file __fixtures__/bad.json'
    );
  });
  test.only('Error is given when a non .json or non .js file is given as a config file', () => {
    inputFromCLI.config = '__fixtures__/sample.html';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(log.error).toHaveBeenCalled();
    expect(outputErrorData).toEqual(
      'Unable to get config file __fixtures__/sample.html'
    );
  });
  test('.json based config file is used before .js based file ', () => {});
  test('Default .json configuration  is config.json', () => {});
  test('Default .json configuration  is config.json', () => {});
});
