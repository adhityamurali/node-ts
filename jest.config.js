const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/source/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@source/(.*)': '<rootDir>/source/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  }
};
