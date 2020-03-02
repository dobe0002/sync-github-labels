const _ = require('lodash');

class Repo {
  constructor(obj = {}) {
    this.repoOwner = _.get(obj, 'owner.login', '');
    this.repoName = obj.name || '';
    this.repoLabels = obj.labels || [];
    this.mastLabels = obj.masterLabels || [];
    this.labelsAddedArray = []; // tracks the result of an attempt to add a label
    this.labelsEditedArray = []; // tracks the result of an attempt to edit a label
    this.labelsRemovedArray = []; // tracks the result of an attempt to remove a label
    this.labelsUpdatedArray = [];
  }

  /** Set label status * */

  labelAdded(label, error = null, inuse = false) {
    // label is a label object
    this.labelsAddedArray.push({ label, error, inuse });
  }

  labelEdited(label, error = null, inuse = false) {
    // label is a label object
    this.labelsEditedArray.push({ label, error, inuse });
  }

  labelUpdated(label, error = null, inuse = false) {
    this.labelsUpdatedArray.push({ label, error, inuse });
  }

  labelRemoved(label, error = null, inuse = false, removed = false) {
    // label is a label object
    this.labelsRemovedArray.push({ label, error, inuse, removed });
  }

  /** Getters and Setters */

  get labelsAdded() {
    return this.labelsAddedArray;
  }

  get labelsEdited() {
    return this.labelsEditedArray;
  }

  get labelsRemoved() {
    return this.labelsRemovedArray;
  }

  get labelsUpdated() {
    return this.labelsUpdatedArray;
  }

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

  get _labels() {
    return this.repoLabels;
  }

  set labels(labels) {
    this.repoLabels = labels;
    return this.repoLabels;
  }

  set masterLabels(labels) {
    this.mastLabels = labels;
    return this.mastLabels;
  }

  get _masterLabels() {
    return this.mastLabels;
  }

  get labelsToAdd() {
    return _.differenceWith(
      this.mastLabels,
      this.repoLabels,
      (label1, label2) => label1.name === label2.name
    );
  }

  get labelsToRemove() {
    // labels in local but not in master
    return _.differenceWith(
      this.repoLabels,
      this.mastLabels,
      (label1, label2) => label1.name === label2.name
    );
  }

  get labelsToEdit() {
    // labels in both local and master but have differences
    // Based on names the same in each repo
    const dupLabels = _.intersectionWith(
      this.mastLabels,
      this.repoLabels,
      (label1, label2) => label1.name === label2.name
    );
    return _.differenceWith(
      dupLabels,
      this.repoLabels,
      (label1, label2) =>
        label1.color === label2.color &&
        label1.description === label2.description
    );
  }

  get labelsToUpdate() {
    // updates labels where the name has changed
    // go through master labels and then pull out ones where new_name  is not equal to name
    return _.reduce(
      this.mastLabels,
      (updateLables, label) => {
        if (label.newName !== '' && label.newName !== label.name) {
          updateLables.push(label);
        }
        return updateLables;
      },
      []
    );
  }
}

module.exports = Repo;
