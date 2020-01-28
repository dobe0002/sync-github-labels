const _ = require('lodash');

class Repo {
  constructor(obj = {}) {
    this.repoOwner = _.get(obj, 'owner.login', '');
    this.repoName = obj.name || '';
  }

  /** Getters and Setters */

  get owner() {
    return this.repoOwner;
  }

  set owner(owner) {
    this.repoOwner = owner;
    return this.repoOwner;
  }

  get name() {
    return this.repoName;
  }

  set name(name) {
    this.repoName = name;
    return this.repoName;
  }

  get fullName() {
    return this.repoOwner !== '' && this.repoName !== ''
      ? `${this.repoOwner}/${this.repoName}`
      : '';
  }

  set fullName(fullName) {
    const splitName = fullName.split('/');
    const owner = splitName[0];
    const name = splitName[1];
    this.owner = owner;
    this.name = name;
  }
  /*
  get labels() {
    return this.repoLabels;
  }

  set labels(labels) {
    this.repoLabels = labels;
    return this.repoLabels;
  }
  */
}

module.exports = Repo;
