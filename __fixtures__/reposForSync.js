const Repo = require('../src/models/Repo');
const Label = require('../src/models/Label');

const masterLabels = [
  new Label({
    name: 'sameLabel',
    color: 'ffffff',
    description: 'this label is the same between repo and master'
  }),
  new Label({
    name: 'changedColor',
    color: 'aaaaaa',
    description: 'this label has a different color'
  }),
  new Label({
    name: 'changedDescription',
    color: '999999',
    description: 'this label has a different description'
  }),
  new Label({
    name: 'newLabel',
    color: '666666',
    description: 'This is a new label not in the repos'
  })
];
const labels = [
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
    description: 'this label has a description'
  })
];

const repos = () => {
  return [
    new Repo({
      owner: { login: 'myOrg' },
      name: 'Repo1',
      masterLabels,
      labels
    }),
    new Repo({
      owner: { login: 'myOrg2' },
      name: 'Repo2',
      masterLabels,
      labels
    })
  ];
};

module.exports = { repos };
