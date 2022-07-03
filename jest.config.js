module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ]
}
