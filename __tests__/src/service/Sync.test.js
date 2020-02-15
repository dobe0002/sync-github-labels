import labelJson from '../../../__fixtures__/git/repoLabels';

const axios = require('axios');
const Sync = require('../../../src/service/Sync');
const SyncOptions = require('../../../src/models/SyncOptions');
const repoLabels = require('../../../__fixtures__/git/repoLabels');
const Label = require('../../../src/models/Label');
const Repo = require('../../../src/models/Repo');
const FixtureRepos = require('../../../__fixtures__/reposForSync');

describe('Sync tests', () => {
  axios.setLabels(repoLabels.default);
  // See the repoLabels file to determine what is expected
  // Expected labels are actually Label objects
  const expectedLabels = [
    {
      labelColor: 'aabbcc',
      labelDescription: 'My newly created label.',
      labelName: 'My New label'
    },
    {
      labelColor: '778899',
      labelDescription: 'Really troublesome insect.',
      labelName: 'Bug :bug:'
    },
    {
      labelColor: 'ddeeff',
      labelDescription: 'This label only lives in the repos.',
      labelName: 'repo label'
    },
    {
      labelColor: 'ffeedd',
      labelDescription: 'This other label only lives in the repos.',
      labelName: 'other repo label'
    }
  ];
  // need tests for missing requirements
  test('Sync labels from input file and output file', () => { });
  test('Sync labels from input file and output list', () => { });
  test('Sync labels from input repo and output file', () => { });
  test('Sync labels from input repo and output list', () => { });
  test('Sync labels  with "sync" flag on', () => { });
  test('Sync labels  with "sync force" flag on', () => { });

  /* **************************************** */
  /** TEMP TESTS = DELETE AFTER DEVELOPMENT */

  test('Get Labels from file', done => {
    const options = new SyncOptions({
      inputFile: '../../__fixtures__/localLabelFile.json',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputOrg: 'myLabelOrg'
    });
    const expected = [
      {
        labelName: 'my label',
        labelColor: 'f00',
        labelDescription: 'This is label'
      },
      {
        labelName: 'my other label',
        labelColor: '0f0',
        labelDescription: 'This is the other label'
      }
    ];
    const sync = new Sync(options);
    sync._getLabels(error => {
      expect(error).toBeNull();
      expect(sync._labelArray[0]).toBeInstanceOf(Label);
      expect(sync._labelArray).toEqual(expected);
      done();
    });

    done();
  });
  test('Get Labels from repo', done => {
    const options = new SyncOptions({
      inputRepo: 'myOwner/myLabelRepo',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputOrg: 'myLabelOrg'
    });

    const sync = new Sync(options);
    sync._getLabels(error => {
      expect(error).toBeNull();
      expect(sync._labelArray[0]).toBeInstanceOf(Label);
      expect(sync._labelArray).toEqual(expectedLabels);
      done();
    });
  });

  test('Get repos from file', done => {
    const options = new SyncOptions({
      inputRepo: 'myOwner/myLabelRepo',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputRepoFile: '../../__fixtures__/localRepoList.json'
    });
    const expected = [
      new Repo({ owner: { login: 'myOrgFromFile' }, name: 'Repo1' }),
      new Repo({ owner: { login: 'myOrgFromFile' }, name: 'Repo2' }),
      new Repo({ owner: { login: 'myOrgFromFile' }, name: 'Repo3' })
    ];
    const sync = new Sync(options);
    sync._getRepos(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(3);
      expect(sync._repoArray[0]).toBeInstanceOf(Repo);
      expect(sync._repoArray).toEqual(expected);

      done();
    });
  });
  test('Get repos from array', done => {
    const options = new SyncOptions({
      inputRepo: 'myOwner/myLabelRepo',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputRepos: ['myOrg1/myRepo1', 'myOrg2/myRepo2']
    });
    const expected = [
      new Repo({ owner: { login: 'myOrg1' }, name: 'myRepo1' }),
      new Repo({ owner: { login: 'myOrg2' }, name: 'myRepo2' })
    ];
    const sync = new Sync(options);

    sync._getRepos(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray).toEqual(expected);
      expect(sync._repoArray[0]).toBeInstanceOf(Repo);
      done();
    });
  });

  test('Get labels for each repo', done => {
    axios.setLabels(labelJson);
    const masterLabels = [
      new Label({
        name: 'My New label',
        color: 'aabbcc',
        description: 'My newly created label.'
      }),
      new Label({
        name: 'repo label',
        color: 'aaaaaa',
        description: 'This label only lives in the repos.'
      }),
      new Label({
        name: 'label only in master',
        color: 'ffffff',
        description: 'this is a very new label'
      })
    ];
    const options = new SyncOptions({
      inputRepo: 'myOwner/myLabelRepo',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputRepos: ['myOrg1/myRepo1', 'myOrg2/myRepo2']
    });

    const sync = new Sync(options);

    sync._repoArray = [
      new Repo({ owner: { login: 'myOrg1' }, name: 'myRepo1' }),
      new Repo({ owner: { login: 'myOrg2' }, name: 'myRepo2' })
    ];
    sync._labelArray = masterLabels;

    sync._getRepoLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);

      expect(sync._repoArray[0]).toBeInstanceOf(Repo);
      expect(sync._repoArray[0]._labels).toHaveLength(4);
      expect(sync._repoArray[0]._masterLabels).toHaveLength(3);
      done();
    });
  });

  test('Add labels to repos', done => {
    const options = new SyncOptions({
      inputFile: '../../__fixtures__/localLabelFile.json',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputOrg: 'myLabelOrg'
    });
    const labelAdded = {
      label: new Label({
        name: 'newLabel',
        color: '666666',
        description: 'This is a new label not in the repos'
      }),
      error: false,
      inuse: false
    };
    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.addLabelsRepos();
    sync._addLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsAdded).toHaveLength(1);
      expect(sync._repoArray[0].labelsAdded[0]).toEqual(labelAdded);
      done();
    });
  });
});
