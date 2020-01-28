import labelJson from '../../../__fixtures__/git/repoLabels';

const axios = require('axios');
const Git = require('../../../src/service/Git');

describe('Git service tests', () => {
  const git = new Git();
  beforeEach(() => {
    axios.reset();
    git.token = 'myGitToken';
    git.url = 'myGitUrl';
  });
  test('Get tokens for repo', async () => {
    axios.setLabels(labelJson);
    const labels = await git.getLabels('myowner', 'myrepo');
    expect(labels.data).toEqual(labelJson);
    expect(axios.getCalls()[0]).toEqual('myGitUrl/repos/myowner/myrepo/labels');
  });
});
