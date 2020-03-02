import Repo from '../../../src/models/Repo';
import Label from '../../../src/models/Label';

describe('Repo Model Tests', () => {
  let repo = {};
  const repoLabels = [
    new Label({
      name: 'sameLabel',
      color: 'ffffff',
      description: 'this label is the same between repo and master'
    }),
    new Label({
      name: 'orphanLabel',
      color: 'eeeeee',
      description: 'this label exists only in the repo'
    }),
    new Label({
      name: 'changedColor',
      color: 'bbbbbb',
      description: 'this label has a different color'
    }),
    new Label({
      name: 'changedDescription',
      color: '999999',
      description: 'this label has a different description'
    }),
    new Label({
      name: 'old name',
      color: 'abc',
      description: ''
    })
  ];

  const masterLabels = [
    new Label({
      name: 'sameLabel',
      color: 'ffffff',
      description: 'this label is the same between repo and master'
    }),
    new Label({
      name: 'newLabel',
      color: 'cccccc',
      description: 'this label is only in the master list'
    }),
    new Label({
      name: 'changedColor',
      color: 'aaaaaa',
      description: 'this label has a different color'
    }),
    new Label({
      name: 'changedDescription',
      color: '999999',
      description: 'this label has a different UPDATED description'
    }),
    new Label({
      name: 'old name',
      new_name: 'new name',
      color: 'abc',
      description: ''
    })
  ];

  beforeEach(() => {
    repo = new Repo();
    repo.labels = repoLabels;
    repo.masterLabels = masterLabels;
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
  });
  test('Set full name', () => {
    expect(repo.owner).toEqual('');
    expect(repo.name).toEqual('');
    repo.fullName = 'myOwner/myName';
    expect(repo.owner).toEqual('myOwner');
    expect(repo.name).toEqual('myName');
  });

  test('Labels to add', () => {
    expect(repo.labelsToAdd).toEqual([
      new Label({
        name: 'newLabel',
        color: 'cccccc',
        description: 'this label is only in the master list'
      })
    ]);
  });
  test('Labels to delete', () => {
    expect(repo.labelsToRemove).toEqual([
      new Label({
        name: 'orphanLabel',
        color: 'eeeeee',
        description: 'this label exists only in the repo'
      })
    ]);
  });
  test('Labels to edit', () => {
    expect(repo.labelsToEdit).toEqual([
      new Label({
        name: 'changedColor',
        color: 'aaaaaa',
        description: 'this label has a different color'
      }),
      new Label({
        name: 'changedDescription',
        color: '999999',
        description: 'this label has a different UPDATED description'
      })
    ]);
  });
  test('Labels to update', () => {
    expect(repo.labelsToUpdate).toEqual([
      new Label({
        name: 'old name',
        new_name: 'new name',
        color: 'abc',
        description: ''
      })
    ]);
  });
});
