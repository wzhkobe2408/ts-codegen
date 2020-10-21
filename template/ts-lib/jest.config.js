/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
    testEnvironment: 'node',
    transform: {
        '\\.[jt]sx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__test__/',
    ],
    coverageDirectory: './coverage',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
    coverageReporters: ['text-summary', 'lcov'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
}
