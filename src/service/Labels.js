// const fs = require('fs');
// const path = require('path');
// const _ = require('lodash');
// const Label = require('../models/Label');
const Git = require('./Git');

class Labels {
  constructor(gitToken = '', gitUrl = '') {
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
    this.git = '';
    this._setGit();
  }

  _setGit() {
    this.git = new Git(this.gitToken, this.gitUrl);
  }

  set token(token) {
    this.gitToken = token;
    this._setGit();
  }

  set url(url) {
    this.gitUrl = url;
    this._setGit();
  }
}

module.exports = Labels;
