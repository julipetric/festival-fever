import { NavigationContainer } from '@react-navigation/native';
import { t } from 'i18n-js';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import theme from '../../assets/theme';

const Stack = createStackNavigator();

function screenOptions() {
  return {
    headerShown: false,
    cardStyle: { backgroundColor: 'transparent' },
  };
}

export default function InitialNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName={t('login')}
        screenOptions={screenOptions}
      >
        <Stack.Screen name={t('login')} component={Login} />
        <Stack.Screen name={t('register')} component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
