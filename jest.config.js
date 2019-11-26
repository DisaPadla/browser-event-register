module.exports = {
  preset: 'ts-jest',
  "roots": [
    "<rootDir>/"
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "coverageDirectory": "./coverage/",
  "collectCoverage": true
};