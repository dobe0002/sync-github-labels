/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
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

    this.defaultJsonConfig = 'config.json';
    this.defaultJSConfig = 'config.js';
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

  set _jsonConfig(configFile) {
    // this is only used for testing
    this.defaultJsonConfig = configFile;
  }

  set _jsConfig(configFile) {
    // this is only used for testing
    this.defaultJSConfig = configFile;
  }

  static _getConfigFile(configFile) {
    let userConfigsFileJSON = {};

    // TODO this fails tests because the tests are picking up my config.json file
    // So I'm wondering if we need a way to set in empty config file
    // NEED a way to set the default config file names that can be over written

    if (configFile !== undefined && configFile !== '') {
      // User passed a config file in the CLI
      try {
        userConfigsFileJSON = SyncOptions._getFile(configFile);
      } catch (err) {
        log.error(`Unable to get config file ${configFile}`);
      }
    } else {
      // No config file passed, so try defaults
      try {
        userConfigsFileJSON = SyncOptions._getFile(this.defaultJsonConfig);
      } catch (err) {
        try {
          userConfigsFileJSON = SyncOptions._getFile(this.defaultJSConfig);
        } catch (error) {
          log.log(`No user config file found.`);
        }
      }
    }
    return userConfigsFileJSON;
  }

  static _getFile(fileName) {
    const filePath = path.join(__dirname, `../../${fileName}`);
    const extension = path.extname(fileName);
    let json = {};
    /*
    try {
      if (extension === '.json') {
        json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } else if (extension === '.js') {
        json = require(filePath);
      } else {
        log.debug(
          this.debugMode,
          `Config file ${fileName} does not end in .json nor .js`
        );
        throw new Error('Unknown config file type');
      }
    } catch (err) {
      log.debug(this.debugMode, `Error trying to get file  ${fileName}`, err);
      throw new Error(`Error trying to get file ${fileName}`);
    }
    return json;

    */
    if (extension === '.json') {
      try {
        json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        log.debug(this.debugMode, `Error reading .json file ${fileName}`, err);
        throw new Error(`Error reading .json file  ${fileName}`);
      }
    } else if (extension === '.js') {
      try {
        json = require(filePath);
      } catch (err) {
        log.debug(this.debugMode, `Error reading .js file  ${fileName}`, err);
        throw new Error(`Error reading .js file  ${fileName}`);
      }
    } else {
      log.debug(
        this.debugMode,
        `Config file ${fileName} does not end in .json nor .js`
      );
      throw new Error(`Config file ${fileName} does not end in .json nor .js`);
    }
    return json;
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
