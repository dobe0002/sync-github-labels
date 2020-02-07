const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const log = require('../service/log');

class SyncOptions {
  constructor(userOptions) {
    const configFileJSON = SyncOptions._getConfigFile(
      _.get(userOptions, 'config')
    );
    const newOptions = SyncOptions._combineConfigFile(
      userOptions,
      configFileJSON
    );

    this.syncInputFile = newOptions.inputFile || '';
    this.syncInputRepo = newOptions.inputRepo || '';
    this.syncGithub = newOptions.github || '';
    this.syncToken = newOptions.token || '';
    this.syncOutputRepos = newOptions.outputRepos || []; // array of ['owner/repo', 'owner/repo']
    this.syncOutputRepoFile = newOptions.outputRepoFile || ''; // file with array of ['owner/repo', 'owner/repo']
    // this.syncOutputOrg = newOptions.outputOrg || ''; TODO later
    this.syncSync = newOptions.sync || false;
    this.syncForce = newOptions.syncForce || false;

    this.hasRequired();
  }
  /** * getters */

  get inputFile() {
    return this.syncInputFile;
  }

  get inputRepo() {
    return this.syncInputRepo;
  }

  get github() {
    return this.syncGithub;
  }

  get token() {
    return this.syncToken;
  }

  get outputRepos() {
    return this.syncOutputRepos;
  }

  get outputRepoFile() {
    return this.syncOutputRepoFile;
  }
  /*
  get _sync() {
    return this.syncSync;
  }

  get _force() {
    return this.syncForce;
  }
  */

  /* Set configs */

  static _getConfigFile(configFile) {
    let userConfigsFileJSON = '';
    try {
      userConfigsFileJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, `${configFile}`), 'utf8')
      );
    } catch (error) {
      log.log('User config file not found.');
    }
    return userConfigsFileJSON;
  }

  static _combineConfigFile(userConfig, configFile) {
    return _.merge(userConfig, configFile);
  }

  hasRequired() {
    // TODO need to add github url
    let hasRequired = true;
    if (this.inputFile === '' && this.inputRepo === '') {
      hasRequired = false;
      log.error('No source for the labels identified');
    }
    if (this.token === '') {
      hasRequired = false;
      log.error('Missing GitHub token.');
    }
    if (
      this.outputRepos === '' &&
      this.outputRepoFile === '' &&
      this.syncOutputOrg === ''
    ) {
      hasRequired = false;
      log.error('No destination for labels identified');
    }
    return hasRequired;
  }
}
module.exports = SyncOptions;
