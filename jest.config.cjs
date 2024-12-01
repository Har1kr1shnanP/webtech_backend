module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  testTimeout: 30000,
  coverageDirectory: "coverage",
  transform: {
    '^.+\\.js$': 'babel-jest', // Transform JavaScript files using babel-jest
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(supertest)/)" // Transpile the supertest module
  ],
};
