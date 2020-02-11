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

  const repoLabels = [];
  let repo = {};

  beforeEach(() => {
    syncLabels = new SyncLabels(git.token, git.url);
    repo = new Repo({ owner: { login: 'myOwner' }, name: 'myRepoName' });
    repo.labels = repoLabels;
    repo.masterLabels = masterLabels;
  });
  test('add labels to a repo', done => {
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
});
