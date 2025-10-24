module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@store': './src/store',
          '@models': './src/models',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@theme': './src/theme',
          '@constants': './src/constants',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
