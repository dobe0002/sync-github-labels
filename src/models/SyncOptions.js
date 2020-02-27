const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const log = require('../service/log');

class SyncOptions {
  constructor(userOptions) {
    const configFileJSON = SyncOptions._getConfigFile(
      _.get(userOptions, 'config'),
      'config'
    );

    const newOptions = SyncOptions._combineConfigFile(
      userOptions,
      configFileJSON
    );

    this.syncInputFile = newOptions.inputFile || ''; // file that lists the master labels
    this.syncInputRepo = newOptions.inputRepo || ''; // owner/repo that contains the master labels
    this.syncGithub = newOptions.github || '';
    this.syncToken = newOptions.token || '';
    this.syncOutputRepos = newOptions.outputRepos || []; // array of ['owner/repo', 'owner/repo']
    this.syncOutputRepoFile = newOptions.outputRepoFile || ''; // file with array of ['owner/repo', 'owner/repo']
    this.syncSync = newOptions.sync || false;
    this.syncForce = newOptions.syncForce || false;
    this.debugMode = newOptions.debug || false;
    this.onlyActive = newOptions.active || false;
  }
  /** * getters */

  get debug() {
    return this.debugMode;
  }

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

  get active() {
    return this.onlyActive;
  }

  get outputRepos() {
    return this.syncOutputRepos;
  }

  get outputRepoFile() {
    return this.syncOutputRepoFile;
  }

  get sync() {
    return this.syncSync;
  }

  get force() {
    return this.syncForce;
  }

  /* Set configs */

  static _getConfigFile(configFile) {
    let userConfigsFileJSON = {};

    if (configFile !== undefined && configFile !== '') {
      try {
        userConfigsFileJSON = JSON.parse(
          fs.readFileSync(path.join(__dirname, `../../${configFile}`), 'utf8')
        );
      } catch (error) {
        log.log('User config file not found.');
        log.debug(
          this.debugMode,
          `Config file ${configFile} could not be found.`,
          error
        );
      }
    }
    return userConfigsFileJSON;
  }

  static _combineConfigFile(userConfig, configFile) {
    return _.merge(userConfig, configFile);
  }

  hasRequired() {
    let hasRequired = true;
    if (this.inputFile === '' && this.inputRepo === '') {
      hasRequired = false;
      log.debug(this.debugMode, 'No source for the labels identified');
    }
    if (this.token === '') {
      hasRequired = false;
      log.debug(this.debugMode, 'Missing GitHub token.');
    }
    if (this.github === '') {
      hasRequired = false;
      log.debug(this.debugMode, 'No GitHub api url is not set.');
    }
    if (this.syncOutputRepos.length === 0 && this.syncOutputRepoFile === '') {
      hasRequired = false;
      log.debug(this.debugMode, 'No destination for labels identified');
    }
    return hasRequired;
  }
}
module.exports = SyncOptions;
