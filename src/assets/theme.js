import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'fuchsia',
    accent: 'white',
    text: 'white',
    placeholder: 'rgb(100,100,100)',
    background: 'rgb(30,30,30)',
    surface: '#3c3c3c',
  },
};

export default theme;
