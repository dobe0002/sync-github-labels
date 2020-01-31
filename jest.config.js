module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/lint-staged.config.js',
    '!**/__fixtures__/**',
    '!**/utils/**'
  ],
  coverageReporters: ['html', 'cobertura', 'json-summary', 'text-summary']
};
