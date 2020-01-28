const tasks = arr => arr.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks([
      // 'npm run lint:all' // Use this if you want to check all files before every commit
      // "lint-staged" // Use this if you want to only check staged files
    ])
  }
};
