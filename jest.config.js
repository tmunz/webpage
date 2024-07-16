module.exports = {
  roots: ['./src'],
  testRegex: 'spec\\.(j|t)sx?$',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageReporters: ['text-summary'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss|styl)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)': '<rootDir>/src/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom'
};
