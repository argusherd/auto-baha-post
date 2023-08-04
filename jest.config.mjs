import { configDotenv } from "dotenv";

configDotenv({ path: ".env.test" });

/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: "renderer",
      moduleNameMapper: {
        // Handle CSS imports (with CSS modules)
        // https://jestjs.io/docs/webpack#mocking-css-modules
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

        // Handle CSS imports (without CSS modules)
        "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

        // Handle image imports
        // https://jestjs.io/docs/webpack#handling-static-assets
        "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i": `<rootDir>/__mocks__/fileMock.js`,

        // Handle module aliases
        "^@/(.*)$": "<rootDir>/$1",
      },
      roots: ["<rootDir>/__tests__/unit/"],
      setupFilesAfterEnv: ["<rootDir>/__tests__/unit/setup/index.ts"],
      testEnvironment: "jsdom",
      testMatch: ["**/*.test.*"],
      testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/renderer/.next/",
      ],
      transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
      },
      transformIgnorePatterns: [
        "/node_modules/",
        "^.+\\.module\\.(css|sass|scss)$",
      ],
    },
    {
      displayName: "backend-api",
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
      preset: "ts-jest",
      roots: ["<rootDir>/__tests__/feature/"],
      setupFilesAfterEnv: ["<rootDir>/__tests__/feature/setup.ts"],
      slowTestThreshold: 30,
      testEnvironment: "node",
      testMatch: ["**/*.test.*"],
    },
  ],
};

export default config;
