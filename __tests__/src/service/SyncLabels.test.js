const axios = require('axios');
const SyncLabels = require('../../../src/service/SyncLabels');
const Label = require('../../../src/models/Label');
const Repo = require('../../../src/models/Repo');

describe('SyncLabels service tests', () => {
  const git = { url: 'myGitUrl', token: 'myGitToken' };
  let syncLabels = {};

  const masterLabels = [
    new Label({
      name: 'myNewLabel',
      color: '111111',
      description: 'my description'
    }),
    new Label({
      name: 'myNewLabel2',
      color: '222222',
      description: 'my description'
    })
  ];

  let repo = {};

  beforeEach(() => {
    syncLabels = new SyncLabels(git.token, git.url);
    repo = new Repo({ owner: { login: 'myOwner' }, name: 'myRepoName' });
    axios.reset();
  });
  test('add labels to a repo', done => {
    repo.labels = [];
    repo.masterLabels = masterLabels;
    const addLabels = repo.labelsToAdd;
    expect(addLabels).toHaveLength(2);

    syncLabels.addLabelsToRepo(repo, (error, labelsAdded) => {
      expect(error).toBeNull();

      expect(axios.getCalls()).toHaveLength(2);
      expect(axios.getCalls()[0].body).toEqual(masterLabels[0].toObject);
      expect(axios.getCalls()[0].endpoint).toEqual(
        'myGitUrl/repos/myOwner/myRepoName/labels'
      );
      expect(axios.getCalls()[0].method).toEqual('post');

      expect(axios.getCalls()[1].body).toEqual(masterLabels[1].toObject);

      expect(labelsAdded).toHaveLength(2);
      expect(labelsAdded[0].label).toEqual(masterLabels[0]);
      expect(labelsAdded[0].error).toEqual(false);
      expect(labelsAdded[0].inuse).toEqual(false);
      done();
    });
  });
  test('edit labels to a repo', done => {
    repo.labels = [
      new Label({
        name: 'myNewLabel',
        color: '111111',
        description: 'THIS IS A NEW DESCRIPTION'
      }),
      new Label({
        // note this shouldn't be picked up as an edit
        name: 'myNewLabel2',
        color: 'newColor',
        description: 'my description'
      })
    ];
    repo.masterLabels = masterLabels;
    const editLabels = repo.labelsToEdit;
    expect(editLabels).toHaveLength(2);

    syncLabels.editLabelsToRepo(repo, (error, labelsEdited) => {
      expect(error).toBeNull();

      expect(axios.getCalls()).toHaveLength(2);
      expect(axios.getCalls()[0].body).toEqual(masterLabels[0].toObject);
      expect(axios.getCalls()[0].endpoint).toEqual(
        'myGitUrl/repos/myOwner/myRepoName/labels/myNewLabel'
      );
      expect(axios.getCalls()[0].method).toEqual('patch');

      expect(axios.getCalls()[1].body).toEqual(masterLabels[1].toObject);

      expect(labelsEdited).toHaveLength(2);
      expect(labelsEdited[0].label).toEqual(masterLabels[0]);
      expect(labelsEdited[0].error).toEqual(false);
      expect(labelsEdited[0].inuse).toEqual(false);
      done();
    });
  });

  test('Delete Labels - forced ', done => {
    repo.labels = [
      new Label({
        name: 'myNewLabel',
        color: '111111',
        description: 'my description'
      }),
      new Label({
        name: 'myNewLabel2',
        color: '222222',
        description: 'my description'
      }),
      new Label({
        name: 'removeMe',
        color: '444444',
        description: 'This label should be removed'
      })
    ];

    const expected = [
      {
        label: new Label({
          name: 'removeMe',
          color: '444444',
          description: 'This label should be removed'
        }),
        error: false,
        inuse: true,
        removed: true
      }
    ];

    repo.masterLabels = masterLabels;
    axios.setLabelsInUse(['removeMe']);

    syncLabels._force = true;

    syncLabels.deleteLabelsFromRepo(repo, (error, labelsRemoved) => {
      expect(error).toBeNull();
      expect(labelsRemoved).toHaveLength(1);
      expect(labelsRemoved).toEqual(expected);

      done();
    });
  });

  test('Delete Labels - do not delete if in use ', done => {
    repo.labels = [
      new Label({
        name: 'keepMe',
        color: '222222',
        description: 'this label is not in master list but is in use'
      }),
      new Label({
        name: 'removeMe',
        color: '444444',
        description: 'This label should be removed'
      })
    ];

    const expected = [
      {
        label: new Label({
          name: 'keepMe',
          color: '222222',
          description: 'this label is not in master list but is in use'
        }),
        error: false,
        inuse: true,
        removed: false
      },
      {
        label: new Label({
          name: 'removeMe',
          color: '444444',
          description: 'This label should be removed'
        }),
        error: false,
        inuse: false,
        removed: true
      }
    ];

    repo.masterLabels = masterLabels;
    axios.setLabelsInUse(['keepMe']);

    // syncLabels._force = false; // this should be the default setting

    syncLabels.deleteLabelsFromRepo(repo, (error, labelsRemoved) => {
      expect(error).toBeNull();
      expect(labelsRemoved).toHaveLength(2);
      expect(labelsRemoved).toEqual(expected);

      done();
    });
  });
});
