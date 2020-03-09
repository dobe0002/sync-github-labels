const _ = require('lodash');

class LabelListReport {
  constructor(obj = {}) {
    this.label = obj.label;
    this.reportRepos = obj.repos || [];
  }

  set addRepos(repoArray) {
    this.reportRepos = repoArray;
  }

  get repos() {
    return this.reportRepos;
  }

  addIssues(repo, issues) {
    const index = _.findIndex(this.repos, r => r.fullName === repo.fullName);
    if (index !== -1) {
      this.repos[index].addIssues = issues;
    }
  }

  get toJSON() {
    const reposchecked = this.reportRepos.length;
    let total = 0;
    let repos = 0;
    _.each(this.reportRepos, repo => {
      total += repo.issues.length;
      if (repo.issues.length > 0) {
        repos += 1;
      }
    });

    return {
      label: {
        name: this.label.name,
        total,
        repos,
        reposchecked
      },
      repos: _.map(this.reportRepos, repo => LabelListReport._repoJSON(repo))
    };
  }

  static _repoJSON(repo) {
    const issues = _.map(repo.issues, issue => {
      return {
        name: issue.name,
        number: issue.number,
        url: issue.url,
        open: issue.isOpen
      };
    });
    return {
      org: repo.owner,
      name: repo.name,
      issues
    };
  }
}

module.exports = LabelListReport;
