import axios from 'axios';
import GetLabels from '../../../src/service/GetLabels';
import Label from '../../../src/models/Label';
import labelJson from '../../../__fixtures__/git/repoLabels';

describe('GetLabels tests', () => {
  let getLabels = new GetLabels();
  beforeEach(() => {
    getLabels = new GetLabels();
  });

  test('Returns array of labels from local file', () => {
    // NOTE path is relative to the src/service directory
    const path = '../../__fixtures__/localLabelFile.json';
    const labels = GetLabels.fromFile(path);
    expect(labels).toHaveLength(2);
    expect(labels[0]).toBeInstanceOf(Label);
    expect(labels[0].name).toEqual('my label');
  });
  test('Gets labels from a repo', async () => {
    axios.setLabels(labelJson);
    getLabels.token = 'myGitHubToken';
    getLabels.url = 'myGitHubUrl';
    const labels = await getLabels.fromRepo('myOwner', 'myRepo');
    expect(labels).toHaveLength(4);
    expect(labels[0]).toBeInstanceOf(Label);
    expect(labels[0].name).toEqual('My New label');
  });
});
