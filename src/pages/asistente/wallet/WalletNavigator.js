import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import WalletHome from './WalletHome';
import WalletTransactions from './WalletTransactions';

const Stack = createStackNavigator();

function WalletNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WalletHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WalletHome" component={WalletHome} />
      <Stack.Screen name="WalletTransactions" component={WalletTransactions} />
    </Stack.Navigator>
  );
}

export default WalletNavigator;
