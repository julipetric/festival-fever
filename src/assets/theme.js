import { DarkTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const theme = {
  ...NavigationDarkTheme,
  ...DarkTheme,
  mode: 'adaptative',
  colors: {
    ...NavigationDarkTheme.colors,
    ...DarkTheme.colors,
    primary: 'fuchsia',
    accent: 'fuchsia',
    text: 'white',
    placeholder: 'rgb(100,100,100)',
    // background: 'rgb(30,30,30)',
    background: 'transparent',
    surface: '#3c3c3c',
    disabled: 'blue',
    error: '#f44336',
  },
};

export default theme;
