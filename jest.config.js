module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|react-native-reanimated|@react-navigation|react-native-gesture-handler|react-native-safe-area-context|react-native-screens)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
  },
};
