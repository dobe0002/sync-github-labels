// const SyncOptions = require('../models/SyncOptions');

const async = require('async');
const _ = require('lodash');
const GetRepos = require('./GetRepos');
const GetLabels = require('./GetLabels');
const log = require('./log');
const Git = require('./Git');
const ReportModel = require('../models/LabelListReport');
const Issue = require('../models/Issue');
const SaveHTML = require('../ui/SaveHTML');

class ListIssues {
  constructor(syncOptions) {
    this.syncOptions = syncOptions;
    this.git = new Git(this.syncOptions.token, this.syncOptions.github);
    this.findLabel = GetLabels.toObject({
      name: this.syncOptions.findLabelName
    });
    this.reportModel = new ReportModel({ label: this.findLabel });
  }

  run(cb = () => {}) {
    async.waterfall(
      [
        _.bind(this._hasRequired, this),
        _.bind(this._getRepos, this),
        _.bind(this._getIssues, this),
        _.bind(this._buildReport, this)
      ],
      error => {
        if (error !== null) {
          log.error(`Creating report failed: ${error}`);
        }

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

  _getRepos(cb) {
    const getRepos = new GetRepos(this.syncOptions);
    getRepos.get((error, repos) => {
      this.reportModel.addRepos = repos;
      cb(error);
    });
  }

  _getIssues(cb) {
    async.eachOfLimit(
      this.reportModel.repos,
      5,
      (repo, key, repoCB) => {
        this.git.getIssues(
          repo.owner,
          repo.name,
          this.findLabel,
          this.syncOptions.active,
          response => {
            // TODO check for error
            const issues = _.map(
              response.data.items,
              issue => new Issue(issue)
            );
            // TODO This doesn't work ... The label isn't set and there isn't a look into the repo  array.
            // Need to add a new item in the report to add issues to the given repo model
            this.reportModel.addIssues(repo, issues);
            repoCB(null);
          }
        );
      },
      err => {
        cb(err);
      }
    );
  }

  _buildReport(cb) {
    const json = this.reportModel.toJSON;
    SaveHTML.issueListHtml(json);
    cb(null);
  }
}

module.exports = ListIssues;
