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
    axios.setLabelsInUse([
      'myLabelInuse',
      'myOtherLabelInUse',
      'myThirdLabelInUse'
    ]);
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
  test('Edit label', async () => {
    const labelToEdit = new Label({
      name: 'mylabel',
      color: 'aaaaaa',
      description: 'My label description'
    });
    const response = await git.editLabel('myOwner', 'myRepo', labelToEdit);
    expect(response.data).toEqual(labelToEdit.toObject);
    expect(response.status).toEqual(200);
    expect(axios.getCalls()[0].method).toEqual('patch');
    expect(axios.getCalls()[0].body).toEqual(labelToEdit.toObject);
  });
  test('Edit label fail if token or github url is not set', async () => {
    git.token = '';
    const responseWithNoToken = await git.editLabel('myowner', 'myrepo');
    expect(responseWithNoToken).toBeInstanceOf(Error);

    git.token = 'myToken';
    git.url = '';
    const responseWithNoURL = await git.editLabel('myowner', 'myrepo');
    expect(responseWithNoURL).toBeInstanceOf(Error);
  });
  test('Delete label', async () => {
    const labelToEdit = new Label({
      name: 'mylabel',
      color: 'aaaaaa',
      description: 'My label description'
    });
    const response = await git.deleteLabel('myOwner', 'myRepo', labelToEdit);
    expect(response.data).toEqual('');
    expect(response.status).toEqual(204);
    expect(axios.getCalls()).toHaveLength(1);
    expect(axios.getCalls()[0].method).toEqual('delete');
    expect(axios.getCalls()[0].endpoint).toEqual(
      'myGitUrl/repos/myOwner/myRepo/labels/mylabel'
    );
  });
  test('Delete label fail if token or github url is not set', async () => {
    git.token = '';
    const responseWithNoToken = await git.deleteLabel('myowner', 'myrepo');
    expect(responseWithNoToken).toBeInstanceOf(Error);

    git.token = 'myToken';
    git.url = '';
    const responseWithNoURL = await git.deleteLabel('myowner', 'myrepo');
    expect(responseWithNoURL).toBeInstanceOf(Error);
  });

  test('Catch that label is in use - all issues', async () => {
    const response = await git.isLabelInUse(
      'myOwner',
      'myRepo',
      new Label({ name: 'myLabelInuse' })
    );
    expect(response).toBeTruthy();
    expect(axios.getCalls()).toHaveLength(1);
    expect(axios.getCalls()[0].endpoint).toEqual(
      'myGitUrl/search/issues?q=repo:myOwner/myRepo+label:myLabelInuse'
    );
  });
  test('Catch that label is in use - active issues', async () => {
    const response = await git.isLabelInUse(
      'myOwner',
      'myRepo',
      new Label({ name: 'myLabelInuse' }),
      true
    );
    expect(response).toBeTruthy();
    expect(axios.getCalls()).toHaveLength(1);
    expect(axios.getCalls()[0].endpoint).toEqual(
      'myGitUrl/search/issues?q=repo:myOwner/myRepo+label:myLabelInuse+is:open'
    );
  });
  test('Catch that label is not in use - all issues', async () => {
    const response = await git.isLabelInUse(
      'myOwner',
      'myRepo',
      new Label({ name: 'myLabelThatIsNotInuse' })
    );
    expect(response).toBeFalsy();
    expect(axios.getCalls()).toHaveLength(1);
    expect(axios.getCalls()[0].endpoint).toEqual(
      'myGitUrl/search/issues?q=repo:myOwner/myRepo+label:myLabelThatIsNotInuse'
    );
  });
  test('Catch that label is not in use - active issues', async () => {
    const response = await git.isLabelInUse(
      'myOwner',
      'myRepo',
      new Label({ name: 'myLabelThatIsNotInuse' }),
      true
    );
    expect(response).toBeFalsy();
    expect(axios.getCalls()).toHaveLength(1);
    expect(axios.getCalls()[0].endpoint).toEqual(
      'myGitUrl/search/issues?q=repo:myOwner/myRepo+label:myLabelThatIsNotInuse+is:open'
    );
  });
  test('Check for label in use fail if token or github url is not set', async () => {
    git.token = '';
    const responseWithNoToken = await git.isLabelInUse('myowner', 'myrepo');
    expect(responseWithNoToken).toBeInstanceOf(Error);

    git.token = 'myToken';
    git.url = '';
    const responseWithNoURL = await git.isLabelInUse('myowner', 'myrepo');
    expect(responseWithNoURL).toBeInstanceOf(Error);
  });
});
