// const SyncOptions = require('../models/SyncOptions');

const async = require('async');
const _ = require('lodash');
const log = require('./log');
const GetLabels = require('./GetLabels');
const GetRepos = require('./GetRepos');
const Repo = require('../models/Repo');
const SyncLabels = require('./SyncLabels');

class Sync {
  constructor(syncOptions) {
    this.syncOptions = syncOptions;
    this.getLabels = new GetLabels(
      this.syncOptions.token,
      this.syncOptions.github,
      this.syncOptions.debug
    );
    this.syncLabels = new SyncLabels(
      this.syncOptions.token,
      this.syncOptions.github,
      this.syncOptions.force
    );

    this.labels = this.syncOptions.labels || []; // Master array of Label objects
    this.repos = []; // Array of Repo objects
  }

  get _labelArray() {
    return this.labels;
  }

  set _labelArray(labels) {
    this.labels = labels;
  }

  get _repoArray() {
    return this.repos;
  }

  set _repoArray(repoArray) {
    this.repos = repoArray;
  }

  run(cb = () => {}) {
    async.waterfall(
      [
        _.bind(this._hasRequired, this),
        _.bind(this._getLabels, this),
        _.bind(this._getRepos, this),
        _.bind(this._getRepoLabels, this),
        _.bind(this._addLabels, this),
        _.bind(this._editLabels, this),
        _.bind(this._updateLabels, this),
        _.bind(this._removeLabels, this)
      ],
      error => {
        if (error !== null) {
          log.error(
            `Label sync encountered an error and did not complete: ${error}`
          );
        }
        _.each(this.repos, repo => {
          log.report(repo);
        });
        cb();
      }
    );
  }

  _hasRequired(cb) {
    return this.syncOptions.hasRequired() // This will causing errors to be logged twice ... logging should be done here.
      ? cb(null)
      : cb(
          `Missing requirements.  Please check that a GitHub url and token is set.`
        );
  }

  _getLabels(cb) {
    if (_.isArray(this.labels) && this.labels.length > 0) {
      this.labels = GetLabels.toLabel(
        this.labels,
        GetLabels.isUmn(this.syncOptions.github)
      );
      cb(null);
    } else if (this.syncOptions.inputFile !== '') {
      this._labelsFromFile(error => cb(error));
    } else if (this.syncOptions.inputRepo !== '') {
      this._labelsFromRepo(error => cb(error));
    } else {
      cb('No source of master labels set.');
    }
  }

  _labelsFromFile(cb) {
    const labels = this.getLabels.fromFile(this.syncOptions.inputFile);
    let error = null;
    if (_.isError(labels)) {
      error = labels.message;
    }
    this.labels = labels;
    return cb(error);
  }

  async _labelsFromRepo(cb) {
    const repo = new Repo();
    repo.fullName = this.syncOptions.inputRepo;
    this.getLabels.fromRepo(repo.owner, repo.name, (error, labels) => {
      this.labels = labels;
      cb(error);
    });
  }

  _getRepos(cb) {
    const getRepos = new GetRepos(this.syncOptions);
    getRepos.get((error, repos) => {
      this.repos = repos;
      cb(error);
    });
  }

  _getRepoLabels(cb) {
    const self = this;
    return async.eachOfLimit(
      this.repos,
      5,
      (_repo, index, repoCB) => {
        self.repos[index].masterLabels = self.labels;
        self.getLabels.fromRepo(
          self.repos[index].owner,
          self.repos[index].name,
          (error, labels) => {
            self.repos[index].labels = labels;
            repoCB(null); // purposely not passing error along because labels for other repos should be tried.
          }
        );
      },
      error => {
        return cb(error);
      }
    );
  }

  _addLabels(cb) {
    const self = this;
    return async.eachOfLimit(
      this.repos,
      5,
      (repo, index, repoCB) => {
        self.syncLabels.addLabelsToRepo(repo, (error, labelsAdded) => {
          labelsAdded.forEach(label => {
            self.repos[index].labelAdded(label.label, label.error, label.inuse);
          });
          repoCB(null); // purposely not passing error so syncing will continue
        });
      },
      error => {
        // not this error will always be null (see repoCB call above)
        return cb(error);
      }
    );
  }

  _editLabels(cb) {
    const self = this;
    return async.eachOfLimit(
      this.repos,
      5,
      (repo, index, repoCB) => {
        self.syncLabels.editLabelsToRepo(repo, (error, labelsEdited) => {
          labelsEdited.forEach(label => {
            self.repos[index].labelEdited(
              label.label,
              label.error,
              label.inuse
            );
          });
          repoCB(null); // purposely not passing error so syncing will continue
        });
      },
      error => {
        // not this error will always be null (see repoCB call above)
        return cb(error);
      }
    );
  }

  _updateLabels(cb) {
    const self = this;
    return async.eachOfLimit(
      this.repos,
      5,
      (repo, index, repoCB) => {
        self.syncLabels.updateLabelsToRepo(repo, (error, labelsUpdated) => {
          labelsUpdated.forEach(label => {
            self.repos[index].labelUpdated(
              label.label,
              label.error,
              label.inuse
            );
          });

          repoCB(null); // purposely not passing error so syncing will continue
        });
      },
      error => {
        // not this error will always be null (see repoCB call above)
        return cb(error);
      }
    );
  }

  _removeLabels(cb) {
    if (this.syncOptions.sync === false && this.syncOptions.force === false) {
      return cb(null);
    }
    const self = this;
    return async.eachOfLimit(
      this.repos,
      5,
      (repo, index, repoCB) => {
        self.syncLabels.deleteLabelsFromRepo(repo, (error, labelsRemoved) => {
          labelsRemoved.forEach(label => {
            self.repos[index].labelRemoved(
              label.label,
              label.error,
              label.inuse,
              label.removed
            );
          });
          repoCB(null); // purposely not passing error so syncing will continue
        });
      },
      error => {
        // not this error will always be null (see repoCB call above)
        return cb(error);
      }
    );
  }
}

module.exports = Sync;
