const fs = require('fs');
const path = require('path');
const Repo = require('../models/Repo');

class GetRepos {
  constructor(syncOptions) {
    this.syncOptions = syncOptions;
  }

  get(cb) {
    let repos = [];
    let error = null;
    if (this.syncOptions.outputRepos.length > 0) {
      repos = this.syncOptions.outputRepos;
    } else if (this.syncOptions.outputRepoFile !== '') {
      try {
        repos = JSON.parse(
          fs.readFileSync(
            path.join(__dirname, `../../${this.syncOptions.outputRepoFile}`),
            'utf8'
          )
        ).outputRepos;
      } catch (err) {
        error = `Unable to read file with output directories`;
      }
    }
    if (repos.length === 0) {
      error = `No output repos identified`;
    }

    const returnRepos = repos.map(repo => {
      const repoObj = new Repo();
      repoObj.fullName = repo;
      return repoObj;
    });
    cb(error, returnRepos);
  }
}

module.exports = GetRepos;
