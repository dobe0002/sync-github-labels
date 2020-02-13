// TODO this should be combined with the Get Labels service
const async = require('async');
const Labels = require('./Labels');

class SyncLabels extends Labels {
  constructor(gitToken = '', gitUrl = '') {
    super(); // notes this.git is inherited
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
    this._setGit();
  }

  async _addLabel(owner, repoName, label) {
    const response = await this.git.addLabel(owner, repoName, label);
    // TODO check for errors;
    return null;
  }

  addLabelsToRepo(repo, cb) {
    const self = this;
    const labelsAdded = [];

    async.eachOfLimit(
      repo.labelsToAdd,
      5,
      async (label, index, labelCB) => {
        const response = await self._addLabel(repo.owner, repo.name, label);
        labelsAdded.push({ label, error: false, inuse: false });
        labelCB(null); // TODO handle errors ... currently assuming success
      },
      error => {
        return cb(error, labelsAdded);
      }
    );
  }

  async _editLabel(owner, repoName, label) {
    const response = await this.git.editLabel(owner, repoName, label);
    // TODO check for errors;
    return null;
  }

  editLabelsToRepo(repo, cb) {
    const self = this;
    const labelsEdited = [];

    async.eachOfLimit(
      repo.labelsToEdit,
      5,
      async (label, index, labelCB) => {
        const response = await self._editLabel(repo.owner, repo.name, label);
        labelsEdited.push({ label, error: false, inuse: false });
        labelCB(null); // TODO handle errors ... currently assuming success
      },
      error => {
        return cb(error, labelsEdited);
      }
    );
  }
  /*
  isLabelInUse() {}

  deleteLabel() {}

  deleteLabelsFromRepo() {}
  */
}

module.exports = SyncLabels;
