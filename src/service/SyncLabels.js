const async = require('async');
const _ = require('lodash');
const Labels = require('./Labels');
const log = require('./log');

class SyncLabels extends Labels {
  constructor(
    gitToken = '',
    gitUrl = '',
    syncForceSetting = false,
    debug = false
  ) {
    super(); // notes this.git is inherited
    this.gitToken = gitToken;
    this.gitUrl = gitUrl;
    this.syncForceSetting = syncForceSetting;
    this.debug = debug;
    this._setGit();
  }

  async _addLabel(owner, repoName, label, cb) {
    let error = null;
    let response = '';

    try {
      response = await this.git.addLabel(owner, repoName, label);
    } catch (err) {
      error = `Failed trying to add label ${label.name} to repo ${repoName}`;
      log.debug(this.debug, error, err);
    }
    return cb(error, response);
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
      (label, index, labelCB) => {
        self._addLabel(repo.owner, repo.name, label, error => {
          // note (error, response) is set back => removed due to linting
          labelsAdded.push({ label, error, inuse: false });
          labelCB(null); // Purposely sending null instead of error so syncing will continue
        });
      },
      error => {
        return cb(error, labelsAdded);
      }
    );
  }

  async _editLabel(owner, repoName, label, cb) {
    let error = null;
    let response = '';
    try {
      response = await this.git.editLabel(owner, repoName, label);
    } catch (err) {
      error = `Failed trying to edit label ${label.name} to repo ${repoName}`;
      log.debug(this.debug, error, err);
    }

    return cb(error, response);
  }

  editLabelsToRepo(repo, cb) {
    const self = this;
    const labelsEdited = [];

    async.eachOfLimit(
      repo.labelsToEdit,
      5,
      (label, index, labelCB) => {
        self._editLabel(repo.owner, repo.name, label, error => {
          // note (error, response) is set back => removed due to linting
          labelsEdited.push({
            label,
            error,
            inuse: false
          });
          labelCB(null); // Purposely sending null instead of error so syncing will continue
        });
      },
      error => {
        return cb(error, labelsEdited);
      }
    );
  }

  async _isLabelInUse(owner, repoName, label, cb) {
    let error = null;
    let response = '';
    try {
      response = await this.git.isLabelInUse(owner, repoName, label);
    } catch (err) {
      error = `Failed to determine if label ${label.name} is in use in repo ${repoName}`;
      log.debug(this.debug, error, err);
    }

    return cb(error, response);
  }

  async _deleteLabel(owner, repoName, label, cb) {
    let error = null;
    let response = '';
    try {
      response = await this.git.deleteLabel(owner, repoName, label);
    } catch (err) {
      error = `Failed trying to delete label ${label.name} from repo ${repoName}`;
      log.debug(this.debug, error, err);
    }
    return cb(error, response);
  }

  deleteLabelsFromRepo(repo, cb) {
    const self = this;
    const labelsRemoved = [];
    async.eachOfLimit(
      repo.labelsToRemove,
      5,
      (label, index, labelCB) => {
        this._isLabelInUse(repo.owner, repo.name, label, (err, inuse) => {
          if (
            err === null &&
            (inuse === false || self.syncForceSetting === true)
          ) {
            self._deleteLabel(repo.owner, repo.name, label, error => {
              // note (error, response) is set back => removed due to linting
              labelsRemoved.push({
                label,
                error,
                inuse,
                removed: _.isNull(error)
              });
              labelCB(null); // Purposely sending null instead of error so syncing will continue
            });
          } else {
            // error on isLabel in use
            labelsRemoved.push({
              label,
              error: err,
              inuse,
              removed: false
            });
            labelCB(null); // Purposely sending null instead of error so syncing will continue
          }
        });
      },
      error => {
        return cb(error, labelsRemoved);
        const badVar = 'badVar2';
      }
    );
  }
}

module.exports = SyncLabels;
