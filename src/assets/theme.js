import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptative',
  colors: {
    ...DefaultTheme.colors,
    primary: 'fuchsia',
    text: 'white',
    placeholder: 'rgb(100,100,100)',
    background: 'rgb(30,30,30)',
    surface: '#3c3c3c',
    disabled: 'blue',
    error: '#f44336',
  },
};

export default theme;
