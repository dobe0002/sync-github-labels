import labelJson from '../../../__fixtures__/git/repoLabels';

const axios = require('axios');
const Sync = require('../../../src/service/Sync');
const SyncOptions = require('../../../src/models/SyncOptions');
const repoLabels = require('../../../__fixtures__/git/repoLabels');
const Label = require('../../../src/models/Label');
const Repo = require('../../../src/models/Repo');
const FixtureRepos = require('../../../__fixtures__/reposForSync');

describe('Sync tests', () => {
  // See the repoLabels file to determine what is expected
  // Expected labels are actually Label objects
  // TODO Change these to Label objects!
  const expectedLabels = [
    {
      umn: false,
      labelColor: 'aabbcc',
      labelDescription: 'My newly created label.',
      labelName: 'My New label',
      labelNewName: ''
    },
    {
      umn: false,
      labelColor: '778899',
      labelDescription: 'Really troublesome insect.',
      labelName: 'Bug :bug:',
      labelNewName: ''
    },
    {
      umn: false,
      labelColor: 'ddeeff',
      labelDescription: 'This label only lives in the repos.',
      labelName: 'repo label',
      labelNewName: ''
    },
    {
      umn: false,
      labelColor: 'ffeedd',
      labelDescription: 'This other label only lives in the repos.',
      labelName: 'other repo label',
      labelNewName: ''
    }
  ];
  beforeEach(() => {
    axios.reset();
    axios.setLabels(repoLabels.default);
  });
  // need tests for missing requirements
  /*
  test('Sync labels from input file and output file', () => { });
  test('Sync labels from input file and output list', () => { });
  test('Sync labels from input repo and output file', () => { });
  test('Sync labels from input repo and output list', () => { });
  test('Sync labels  with "sync" flag on', () => { });
  test('Sync labels  with "sync force" flag on', () => { });
*/
  /* **************************************** */
  /** TEMP TESTS = DELETE AFTER DEVELOPMENT  and above tests are implemented */

  test('Get Labels from file', done => {
    const options = new SyncOptions(
      {
        inputFile: '__fixtures__/localLabelFile.json',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg'
      },
      'no_config',
      'no_config'
    );
    const expected = [
      {
        umn: false,
        labelName: 'my label',
        labelColor: 'f00',
        labelDescription: 'This is label',
        labelNewName: ''
      },
      {
        umn: false,
        labelName: 'my other label',
        labelColor: '0f0',
        labelDescription: 'This is the other label',
        labelNewName: ''
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
    const options = new SyncOptions(
      {
        inputRepo: 'myOwner/myLabelRepo',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg'
      },
      'noConfig',
      'noConfig'
    );

    const sync = new Sync(options);
    sync._getLabels(error => {
      expect(error).toBeNull();
      expect(sync._labelArray[0]).toBeInstanceOf(Label);
      expect(sync._labelArray).toEqual(expectedLabels);
      done();
    });
  });

  test('Get labels from config file', done => {
    const options = new SyncOptions({
      inputRepo: 'myOwner/myLabelRepo',
      config: '__fixtures__/configWithLabels.json',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputRepoFile: '__fixtures__/localRepoList.json'
    });
    const sync = new Sync(options);
    sync._getLabels(error => {
      expect(error).toBeNull();
      expect(sync._labelArray).toHaveLength(2);
      expect(sync._labelArray[0]).toBeInstanceOf(Label);
      expect(sync._labelArray[0].name).toEqual('my config label');
      done();
    });
  });

  test('Get repos from file', done => {
    const options = new SyncOptions(
      {
        inputRepo: 'myOwner/myLabelRepo',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputRepoFile: '__fixtures__/localRepoList.json'
      },
      'noConfig',
      'noConfig'
    );
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
    const options = new SyncOptions(
      {
        inputRepo: 'myOwner/myLabelRepo',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputRepos: ['myOrg1/myRepo1', 'myOrg2/myRepo2']
      },
      'noConfig',
      'noConfig'
    );
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
    const options = new SyncOptions(
      {
        inputRepo: 'myOwner/myLabelRepo',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputRepos: ['myOrg1/myRepo1', 'myOrg2/myRepo2']
      },
      'noConfig',
      'noConfig'
    );

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
    const options = new SyncOptions(
      {
        inputFile: '../../__fixtures__/localLabelFile.json',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg'
      },
      'noConfig',
      'noConfig'
    );
    const labelAdded = {
      label: new Label({
        name: 'newLabel',
        color: '666666',
        description: 'This is a new label not in the repos'
      }),
      error: null,
      inuse: false
    };
    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._addLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsAdded).toHaveLength(1);
      expect(sync._repoArray[0].labelsAdded[0]).toEqual(labelAdded);
      done();
    });
  });

  test('Edited labels to repos', done => {
    const options = new SyncOptions(
      {
        inputFile: '../../__fixtures__/localLabelFile.json',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg'
      },
      'noConfig',
      'noConfig'
    );
    const labelsEdited = [
      {
        label: new Label({
          name: 'changedColor',
          color: 'aaaaaa',
          description: 'this label has a different color'
        }),
        error: null,
        inuse: false
      },
      {
        label: new Label({
          name: 'changedDescription',
          color: '999999',
          description: 'this label has a different description'
        }),
        error: null,
        inuse: false
      }
    ];

    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._editLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsEdited).toHaveLength(2);
      expect(sync._repoArray[0].labelsEdited).toEqual(labelsEdited);
      done();
    });
  });

  test('Updated labels to repos', done => {
    // aka a label name has changed
    const options = new SyncOptions(
      {
        github: 'myGitHubRepo',
        token: 'myGitHubToken'
      },
      'noConfig',
      'noConfig'
    );

    const demoRepo = new Repo({
      owner: { login: 'myOrg' },
      name: 'myRepo',
      labels: [
        new Label({
          name: 'my Label',
          color: 'aaaaaa',
          description: 'a description',
          umn: true
        })
      ],
      masterLabels: [
        new Label({
          name: 'my Label',
          new_name: 'My NEW NAME',
          color: 'aaaaaa',
          description: 'a description',
          umn: true
        })
      ]
    });

    const expected = {
      label: new Label({
        name: 'my Label',
        new_name: 'My NEW NAME',
        color: 'aaaaaa',
        description: 'a description',
        umn: true
      }),
      error: null,
      inuse: false
    };

    const sync = new Sync(options);
    sync._repoArray = [demoRepo];
    sync._updateLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(1);
      expect(sync._repoArray[0].labelsUpdated).toHaveLength(1);
      expect(sync._repoArray[0].labelsUpdated[0]).toEqual(expected);
      done();
    });
  });

  test('Syncing is skipped if sync and force are not set', done => {
    const options = new SyncOptions({
      inputFile: '../../__fixtures__/localLabelFile.json',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputOrg: 'myLabelOrg'
    });
    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._removeLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toEqual(FixtureRepos.repos());
      done();
    });
  });

  test('Labels not in use removed with force setting', done => {
    const options = new SyncOptions(
      {
        inputFile: '../../__fixtures__/localLabelFile.json',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg',
        syncForce: true
      },
      'noConfig',
      'noConfig'
    );

    const expected = [
      {
        label: new Label({
          name: 'orphanLabel',
          color: 'eeeeee',
          description: 'this label exists only in the repo'
        }),
        error: null,
        inuse: false,
        removed: true
      }
    ];

    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._removeLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsRemoved).toHaveLength(1);
      expect(sync._repoArray[0].labelsRemoved).toEqual(expected);
      done();
    });
  });

  test('Labels in use removed with force setting', done => {
    const options = new SyncOptions(
      {
        inputFile: '../../__fixtures__/localLabelFile.json',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg',
        syncForce: true
      },
      'noConfig',
      'noConfig'
    );

    const expected = [
      {
        label: new Label({
          name: 'orphanLabel',
          color: 'eeeeee',
          description: 'this label exists only in the repo'
        }),
        error: null,
        inuse: true,
        removed: true
      }
    ];
    axios.setLabelsInUse(['orphanLabel']);

    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._removeLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsRemoved).toHaveLength(1);
      expect(sync._repoArray[0].labelsRemoved).toEqual(expected);
      done();
    });
  });

  test('Labels not in use removed without force setting', done => {
    const options = new SyncOptions(
      {
        inputFile: '../../__fixtures__/localLabelFile.json',
        github: 'myGitHubRepo',
        token: 'myGitHubToken',
        outputOrg: 'myLabelOrg',
        sync: true
      },
      'noConfig',
      'noConfig'
    );

    const expected = [
      {
        label: new Label({
          name: 'orphanLabel',
          color: 'eeeeee',
          description: 'this label exists only in the repo'
        }),
        error: null,
        inuse: false,
        removed: true
      }
    ];

    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._removeLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsRemoved).toHaveLength(1);
      expect(sync._repoArray[0].labelsRemoved).toEqual(expected);
      done();
    });
  });

  test('Labels in use not removed without force setting', done => {
    const options = new SyncOptions({
      inputFile: '../../__fixtures__/localLabelFile.json',
      github: 'myGitHubRepo',
      token: 'myGitHubToken',
      outputOrg: 'myLabelOrg',
      sync: true
    });

    const expected = [
      {
        label: new Label({
          name: 'orphanLabel',
          color: 'eeeeee',
          description: 'this label exists only in the repo'
        }),
        error: null,
        inuse: true,
        removed: false
      }
    ];
    axios.setLabelsInUse(['orphanLabel']);

    const sync = new Sync(options);
    sync._repoArray = FixtureRepos.repos();
    sync._removeLabels(error => {
      expect(error).toBeNull();
      expect(sync._repoArray).toHaveLength(2);
      expect(sync._repoArray[0].labelsRemoved).toHaveLength(1);
      expect(sync._repoArray[0].labelsRemoved).toEqual(expected);
      done();
    });
  });
});
