import { transform } from "typescript";

module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  testMatch: ["**/?(*.)+(test).ts?(x)"],
  transform: {
    "^.\\.(ts|tsx)$": "ts-jest",
  },

  setupFilesAfterEnv: ["./jest.setup.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
