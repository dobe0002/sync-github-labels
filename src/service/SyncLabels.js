// TODO this should be combined with the Get Labels service
const async = require('async');
const Labels = require('./Labels');

class SyncLabels extends Labels {
  constructor(gitToken = '', gitUrl = '', syncForceSetting = false) {
    super(); // notes this.git is inherited
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
    this.syncForceSetting = syncForceSetting;
    this._setGit();
  }

  async _addLabel(owner, repoName, label) {
    const response = await this.git.addLabel(owner, repoName, label);
    // TODO check for errors;
    return null;
  }

  set _force(forceSetting) {
    this.syncForceSetting = forceSetting;
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

  async _isLabelInUse(owner, repoName, label, onlyActive = false) {
    return this.git.isLabelInUse(owner, repoName, label, onlyActive);
  }

  async _deleteLabel(owner, repoName, label) {
    const response = await this.git.deleteLabel(owner, repoName, label);
    // TODO check for errors;
    return null;
  }

  deleteLabelsFromRepo(repo, cb) {
    const self = this;
    const labelsRemoved = [];

    async.eachOfLimit(
      repo.labelsToRemove,
      5,
      async (label, index, labelCB) => {
        const inuse = await this._isLabelInUse(repo.owner, repo.name, label);
        let removed = false;
        if (inuse === false || self.syncForceSetting === true) {
          const response = await self._deleteLabel(
            repo.owner,
            repo.name,
            label
          );
          removed = true;
        }

        labelsRemoved.push({ label, error: false, inuse, removed });
        labelCB(null); // TODO handle errors ... currently assuming success
      },
      error => {
        return cb(error, labelsRemoved);
      }
    );
  }
}

module.exports = SyncLabels;
