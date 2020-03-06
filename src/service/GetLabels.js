const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Label = require('../models/Label');
const log = require('./log');

const Labels = require('./Labels');

class GetLabels extends Labels {
  constructor(gitToken = '', gitUrl = '', debugMode = false) {
    super(); // notes this.git is inherited
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
    this.debug = debugMode;
    this._setGit();
    this.umn = GetLabels.isUmn(this.gitUrl);
  }

  static isUmn(gitUrl) {
    return gitUrl.includes('umn.edu');
  }

  fromFile(filePath) {
    let labelJson = [];
    if (filePath !== undefined && filePath !== '') {
      try {
        labelJson = JSON.parse(
          fs.readFileSync(path.join(__dirname, `../../${filePath}`), 'utf8')
        ).labels;
      } catch (error) {
        log.debug(this.debug, `File ${filePath} not found.`);
        return new Error(`File ${filePath} not found.`);
      }
    }

    return GetLabels.toLabel(labelJson, this.umn);
  }

  static toLabel(labelJson, isUmn = false) {
    const newLabels = _.map(labelJson, label => {
      return label instanceof Label ? label : new Label(label);
    });
    return _.each(newLabels, label => {
      const labelObj = label;
      labelObj.isUmn = isUmn;
      return labelObj;
    });
  }

  async fromRepo(owner, repo, cb) {
    // note repo is the repo name and not a repo object
    let labels = [];
    let error = null;
    try {
      const labelJson = await this.git.getLabels(owner, repo);
      labels = _.map(labelJson.data, gitHubLabel => {
        // this.isUMN = obj.umn || false;
        const label = gitHubLabel;
        label.isUmn = this.umn;
        return new Label(label);
      });
    } catch (err) {
      log.debug(
        this.debug,
        `Unable to pull labels for repo ${repo.name}.  ${err}`
      );
      error = `Unable to pull labels from  repo ${repo.name}.`;
    }
    cb(error, labels);
  }
}

module.exports = GetLabels;
