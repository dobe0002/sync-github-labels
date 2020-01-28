import Repo from '../../../src/models/Repo';

describe('Repo Model Tests', () => {
  let repo = {};
  beforeEach(() => {
    repo = new Repo();
  });
  test('Is instance of Repo', () => {
    expect(repo).toBeInstanceOf(Repo);
  });
  test('Getters and setters', () => {
    expect(repo.owner).toBeFalsy();
    expect(repo.name).toBeFalsy();
    expect(repo.fullName).toBeFalsy();

    repo.owner = 'myOwner';
    repo.name = 'myName';

    expect(repo.owner).toEqual('myOwner');
    expect(repo.name).toEqual('myName');
    expect(repo.fullName).toEqual('myOwner/myName');
    // expect(repo.labels).toEqual(['myLabels']);
  });
  test('Set full name', () => {
    expect(repo.owner).toEqual('');
    expect(repo.name).toEqual('');
    repo.fullName = 'myOwner/myName';
    expect(repo.owner).toEqual('myOwner');
    expect(repo.name).toEqual('myName');
  });
});
