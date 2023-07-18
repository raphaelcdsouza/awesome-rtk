module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '<rootDir>/src/Infra/Gateways/awsCognitoIdentityProvider/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests',
  ],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  clearMocks: true,
};
