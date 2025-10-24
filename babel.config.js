module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@models': './src/models',
          '@utils': './src/utils',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@constants': './src/constants',
          '@types': './src/types',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
