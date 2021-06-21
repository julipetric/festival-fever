import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainCorporativo from '../corporativo/MainCorporativo';
import MainAsistente from '../asistente/MainAsistente';
import AuthNavigator from './AuthNavigator';
import theme from '../../assets/theme';

const Stack = createStackNavigator();

export default function InitialNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator headerMode="none" initialRouteName="AuthNavigator">
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen name="MainCorporativo" component={MainCorporativo} />
        <Stack.Screen name="MainAsistente" component={MainAsistente} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
