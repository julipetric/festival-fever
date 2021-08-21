import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from 'i18n-js';
import MyAccountMain from './MyAccountMain';
import { PinkPrimary } from '../../../assets/Colors';
import PersonalInformation from './PersonalInformation';

const Stack = createStackNavigator();

export default function MyAccount() {
  return (
    <Stack.Navigator
      activeColor={PinkPrimary}
      initialRouteName="MyAccountMain"
      screenOptions={{
        headerBackground: () => (
          <LinearGradient
            colors={['#F936CC', '#830DB4']}
            style={{ flex: 1 }}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
          />
        ),
        presentation: 'modal',
      }}
    >
      <Stack.Screen name={t('myAccount')} component={MyAccountMain} />
      <Stack.Screen
        name={t('personalInformation')}
        component={PersonalInformation}
      />
    </Stack.Navigator>
  );
}
