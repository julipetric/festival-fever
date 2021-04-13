import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import MisEventosScreen from './MisEventosScreen';
import { PinkPrimary } from '../../../assets/Colors';

const Tab = createMaterialBottomTabNavigator();

export default function MainAsistente() {
  const profile = useSelector(state => state.firebase.profile);

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          activeColor={PinkPrimary}
          initialRouteName="Mis Eventos"
          tabBarOptions={{
            activeTintColor: PinkPrimary,
            style: { position: 'absolute' },
          }}
          barStyle={{
            backgroundColor: 'black',
          }}
        >
          <Tab.Screen
            name="Mis Eventos"
            component={MisEventosScreen}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="calendar-alt" size={23} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Leer Código QR"
            component={MisEventosScreen}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="qr-code-scanner" size={26} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" translucent />
    </>
  );
}
