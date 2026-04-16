/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [5101]
      }
    }],
  },
};
