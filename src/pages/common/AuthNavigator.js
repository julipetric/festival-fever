import { t } from 'i18n-js';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import Login from './Login';
import Register from './Register';
import { setUserRole } from '../../redux/myStoreSlice';

const Stack = createStackNavigator();

function screenOptions() {
  return {
    headerShown: false,
    cardStyle: { backgroundColor: 'transparent' },
  };
}

export default function AuthNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserRole(undefined));
  });

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
