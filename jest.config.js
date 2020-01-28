module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/webpack.config.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/build/**',
    '!**/jest.config.js',
    '!**/__fixtures__/**',
    '!**/utils/**'
  ],
  coverageReporters: ['html', 'cobertura', 'json-summary', 'text-summary']
};
