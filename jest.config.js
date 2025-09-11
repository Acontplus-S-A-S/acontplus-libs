module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: [
    '<rootDir>/projects/test-app',
    '<rootDir>/projects/acontplus-core',
    '<rootDir>/projects/acontplus-ui-components',
  ],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'projects/**/src/**/*.ts',
    '!projects/**/src/**/*.spec.ts',
    '!projects/**/src/**/*.test.ts',
    '!projects/**/src/**/index.ts',
    '!projects/**/src/**/public-api.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@acontplus-core$': '<rootDir>/projects/acontplus-core/src/public-api.ts',
    '^@acontplus-ui-components$': '<rootDir>/projects/acontplus-ui-components/src/public-api.ts',
    '^acontplus-core$': '<rootDir>/projects/acontplus-core/src/public-api.ts',
    '^acontplus-ui-components$': '<rootDir>/projects/acontplus-ui-components/src/public-api.ts',
  },
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        useESM: true,
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};
