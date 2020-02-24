import axios from 'axios';
import _ from 'lodash';
import GetLabels from '../../../src/service/GetLabels';
import Label from '../../../src/models/Label';
import labelJson from '../../../__fixtures__/git/repoLabels';

describe('GetLabels tests', () => {
  let getLabels = new GetLabels();
  beforeEach(() => {
    getLabels = new GetLabels();
  });

  test('Returns array of labels from local file', () => {
    const path = '__fixtures__/localLabelFile.json';
    const labels = GetLabels.fromFile(path);
    expect(labels).toHaveLength(2);
    expect(labels[0]).toBeInstanceOf(Label);
    expect(labels[0].name).toEqual('my label');
  });
  test('Fail get from file, missing file path', () => {
    const path = '';
    const labels = GetLabels.fromFile(path);
    expect(labels).toHaveLength(0);
  });
  test('Fail get from file, cannot file path', () => {
    const path = 'cannotFindMe.json';
    const labels = GetLabels.fromFile(path);
    expect(_.isError(labels)).toBeTruthy();
  });
  test('Gets labels from a repo', done => {
    axios.setLabels(labelJson);
    getLabels.token = 'myGitHubToken';
    getLabels.url = 'myGitHubUrl';
    getLabels.fromRepo('myOwner', 'myRepo', (error, labels) => {
      expect(error).toBeNull();
      expect(labels).toHaveLength(4);
      expect(labels[0]).toBeInstanceOf(Label);
      expect(labels[0].name).toEqual('My New label');
      done();
    });
  });
  test('Gets labels from a repo - failure', done => {
    axios.setError('label not found', 404);
    getLabels.token = 'myGitHubToken';
    getLabels.url = 'myGitHubUrl';
    getLabels.fromRepo('myOwner', 'myRepo', (error, labels) => {
      expect(error).not.toBeNull();

      // expect(labels).not.toBeNull();
      done();
    });
  });
});
