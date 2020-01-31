import SyncOptions from '../../../src/models/SyncOptions';

describe('Sync Options Model tests', () => {
  let syncOptions = {};
  let inputFromCLI = {};
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
    inputFromCLI.config = '../../__fixtures__/config.json';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.inputFile).toEqual('MyNewInputFile');
    expect(syncOptions.inputRepo).toBeFalsy();
    expect(syncOptions.github).toEqual('myGitHub');
    expect(syncOptions.token).toEqual('MyGitHubToken');
  });
  test('Has required - pass', () => {
    inputFromCLI.token = 'myToken';
    syncOptions = new SyncOptions(inputFromCLI);
    expect(syncOptions.token).toBeTruthy();
    expect(syncOptions.hasRequired()).toBeTruthy();
  });
  test('Has Required - fail', () => {
    // TODO add a check for missing inputFile and outputRepos
    expect(syncOptions.token).toBeFalsy();
    expect(syncOptions.hasRequired()).toBeFalsy();
  });
});
