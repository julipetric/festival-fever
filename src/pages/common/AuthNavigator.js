import { t } from 'i18n-js';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';

const Stack = createStackNavigator();

function screenOptions() {
  return {
    headerShown: false,
    cardStyle: { backgroundColor: 'transparent' },
  };
}

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={t('login')}
      screenOptions={screenOptions}
    >
      <Stack.Screen name={t('login')} component={Login} />
      <Stack.Screen name={t('register')} component={Register} />
    </Stack.Navigator>
  );
}
