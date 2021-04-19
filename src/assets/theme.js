import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'fuchsia',
    accent: 'white',
    text: 'white',
    placeholder: 'rgb(100,100,100)',
    background: 'rgba(0,0,0, 0.2)',
  },
};

export default theme;
