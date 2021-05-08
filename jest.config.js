/* eslint-disable @typescript-eslint/naming-convention */

module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '_src(.*)$': '<rootDir>/src/$1',
  },
};
