// const SyncOptions = require('../models/SyncOptions');

const async = require('async');
const _ = require('lodash');
const log = require('./log');
const GetLabels = require('./GetLabels');
const Repo = require('../models/Repo');

class Sync {
  constructor(syncOptions) {
    this.syncOptions = syncOptions;
    this.labels = []; // array of Label objects
    this.repos = []; // array of Repo objects
  }

  syncLabels() {
    async.waterfall(
      [
        _.bind(this.hasRequired, this),
        _.bind(this.getLabels, this),
        _.bind(this.getRepos, this),
        _.bind(this.saveLabels, this)
      ],
      error => {
        if (error !== null) {
          log('Label sync encountered an error and did not complete.', 'error');
        }
      }
    );
  }

  hasRequired(cb) {
    return this.syncOptions.hasRequired()
      ? cb(null)
      : cb('Missing requirements');
  }

  async getLabels(cb) {
    if (this.syncOptions.inputFile !== '') {
      this.labels = GetLabels.fromFile(this.syncOptions.inputFile);
      // TODO check for errors
      cb(null);
    } else if (this.syncOptions.inputRepo !== '') {
      const getLabels = new GetLabels(
        this.syncOptions.github,
        this.syncOptions.token
      );
      // TODO check for errors

      const repo = new Repo();
      repo.fullName = this.syncOptions.inputRepo;
      this.labels = await getLabels.fromRepo(repo.owner, repo.name);
      cb(null);
    } else {
      cb('No source of labels');
    }
  }

  getRepos(cb) {}

  saveLabels(cb) {}
}

module.exports = Sync;
