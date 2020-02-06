import labelJson from '../../../__fixtures__/git/repoLabels';

const axios = require('axios');
const Git = require('../../../src/service/Git');
const Label = require('../../../src/models/Label');

describe('Git service tests', () => {
  const git = new Git();
  beforeEach(() => {
    axios.reset();
    git.token = 'myGitToken';
    git.url = 'myGitUrl';
  });
  test('Get labels fail if token or github url is not set', async () => {
    git.token = '';
    const responseWithNoToken = await git.getLabels('myowner', 'myrepo');
    expect(responseWithNoToken).toBeInstanceOf(Error);

    git.token = 'myToken';
    git.url = '';
    const responseWithNoURL = await git.getLabels('myowner', 'myrepo');
    expect(responseWithNoURL).toBeInstanceOf(Error);
  });
  test('Get labels from a repo', async () => {
    axios.setLabels(labelJson);
    const labels = await git.getLabels('myowner', 'myrepo');
    expect(labels).not.toBeInstanceOf(Error);
    expect(labels.data).toEqual(labelJson);
    expect(axios.getCalls()[0].endpoint).toEqual(
      'myGitUrl/repos/myowner/myrepo/labels'
    );
  });
  test('Create label fails if token or url is not set', async () => {
    git.token = '';
    const responseWithNoToken = await git.addLabel('myowner', 'myrepo');
    expect(responseWithNoToken).toBeInstanceOf(Error);

    git.token = 'myToken';
    git.url = '';
    const responseWithNoURL = await git.addLabel('myowner', 'myrepo');
    expect(responseWithNoURL).toBeInstanceOf(Error);
  });
  test('Create label', async () => {
    const labelToAdd = new Label({
      name: 'mylabel',
      color: 'aaaaaa',
      description: 'My label description'
    });
    const response = await git.addLabel('myOwner', 'myRepo', labelToAdd);
    expect(response.data).toEqual(labelToAdd.toObject);
    expect(response.status).toEqual(201);
  });
});
