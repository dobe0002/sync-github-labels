const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Label = require('../models/Label');
const Git = require('./Git');

class GetLabels {
  constructor(gitToken = '', gitUrl = '') {
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
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

  static fromFile(filePath) {
    // TODO .. need to find a better way to determine path of file
    const labelJson = JSON.parse(
      // TODO check for errors
      fs.readFileSync(path.join(__dirname, filePath), 'utf8')
    );
    return _.map(labelJson, label => new Label(label));
  }

  async fromRepo(owner, repo) {
    const labelJson = await this.git.getLabels(owner, repo);
    // TODO ... check for errors
    const labels = _.map(labelJson.data, label => {
      return new Label(label);
    });
    return labels;
  }
  // fromRepo(repo) {}
}

module.exports = GetLabels;
