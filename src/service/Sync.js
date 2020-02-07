// const SyncOptions = require('../models/SyncOptions');

const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const log = require('./log');
const GetLabels = require('./GetLabels');
const Repo = require('../models/Repo');
const SyncLabels = require('./SyncLabels');

class Sync {
  constructor(syncOptions) {
    this.syncOptions = syncOptions;
    this.getLabels = new GetLabels(
      this.syncOptions.token,
      this.syncOptions.github
    );
    this.syncLabels = new SyncLabels(
      this.syncOptions.token,
      this.syncOptions.github
    );

    this.labels = []; // Master array of Label objects
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

  syncLabels() {
    async.waterfall(
      [
        _.bind(this._hasRequired, this),
        _.bind(this._getLabels, this),
        _.bind(this._getRepos, this),
        _.bind(this._getRepoLabels, this),
        _.bind(this._addLabels, this),
        _.bind(this._editLabels, this),
        _.bind(this._removeLabels, this)
      ],
      error => {
        if (error !== null) {
          log('Label sync encountered an error and did not complete.', 'error');
        }
        // Report summary
      }
    );
  }

  _hasRequired(cb) {
    return this.syncOptions.hasRequired()
      ? cb(null)
      : cb('Missing requirements');
  }

  _getLabels(cb) {
    if (this.syncOptions.inputFile !== '') {
      this._labelsFromFile(error => cb(error));
    } else if (this.syncOptions.inputRepo !== '') {
      this._labelsFromRepo(response => cb(response));
    } else {
      cb('No source of labels');
    }
  }

  _labelsFromFile(cb) {
    this.labels = GetLabels.fromFile(this.syncOptions.inputFile);
    return cb(null);
  }

  async _labelsFromRepo(cb) {
    // TODO check for errors

    const repo = new Repo();
    repo.fullName = this.syncOptions.inputRepo;
    this.labels = await this.getLabels.fromRepo(repo.owner, repo.name);
    cb(null);
  }

  _getRepos(cb) {
    let repos = [];
    if (this.syncOptions.outputRepos.length !== 0) {
      repos = this.syncOptions.outputRepos;
    } else if (this.syncOptions.outputRepoFile !== '') {
      // TODO check for errors in getting/reading file
      repos = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, this.syncOptions.outputRepoFile),
          'utf8'
        )
      );
    } else return cb('No output repos set');
    this.repos = repos.map(repo => {
      const repoObj = new Repo();
      repoObj.fullName = repo;
      return repoObj;
    });
    return cb(null);
  }

  _getRepoLabels(cb) {
    const self = this;

    return async.eachOfLimit(
      this.repos,
      5,
      async (_repo, index, repoCB) => {
        self.repos[index].masterLabels = self.labels;
        self.repos[index].labels = await self.getLabels.fromRepo(
          self.repos[index].owner,
          self.repos[index].name
        );
        repoCB(null);
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
      async (repo, index, repoCB) => {
        self.syncLabels.addLabelsToRepo(repo, (error, labelsAdded) => {
          labelsAdded.forEach(label => {
            // this just updates the repo with status of label adds
            self.repos[index].labelAdded(label.label, label.error, label.inuse);
          });
          repoCB(error);
        });
      },
      error => {
        return cb(error);
      }
    );
  }
}

module.exports = Sync;
