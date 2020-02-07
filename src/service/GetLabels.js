const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Label = require('../models/Label');

const Labels = require('./Labels');

class GetLabels extends Labels {
  constructor(gitToken = '', gitUrl = '') {
    super(); // notes this.git is inherited
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
    this._setGit();
  }

  static fromFile(filePath) {
    // TODO .. need to find a better way to determine path of file
    const labelJson = JSON.parse(
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
}

module.exports = GetLabels;
