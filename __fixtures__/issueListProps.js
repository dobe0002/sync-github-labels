module.exports = {
  label: {
    name: 'My Cool Label',
    color: '',
    description: '',
    total: 3,
    repos: 2,
    reposchecked: 5
  },
  repos: [
    {
      org: 'my org',
      name: 'my repo',
      issues: [
        {
          name: 'This is an issue',
          number: 321,
          url: 'https://google.com',
          open: true
        },
        {
          name: 'This is another issue',
          number: 322,
          url: 'https://google.com',
          open: false
        }
      ]
    },
    {
      org: 'my other org',
      name: 'my other repo',
      issues: [
        {
          name: 'This is a super cool issue',
          number: 221,
          url: 'https://google.com',
          open: true
        }
      ]
    },
    {
      org: 'my empty org',
      name: 'my empty repo',
      issues: []
    }
  ]
};
