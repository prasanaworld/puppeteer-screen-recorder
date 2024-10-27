const { createJestPreset } = require("ts-jest");
const defaultPreset = createJestPreset()

const config = {
  ...defaultPreset,
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  forceExit: true,
  testMatch: [
    "<rootDir>/src/**/*.spec.ts"
  ],
};

module.exports = config