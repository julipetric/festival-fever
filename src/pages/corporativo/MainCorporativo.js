import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import MisEventosScreen from '../asistente/MisEventosScreen';
import { PinkPrimary } from '../../../assets/Colors';
import theme from '../../assets/theme';
import FestivalFeverHeader from '../components/FestivalFeverHeader';

const Tab = createMaterialBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  mainLayout: {
    flex: 1,
  },
  elementsPadding: {
    margin: 10,
  },
  button: {
    margin: 10,
  },
});

export default function MainCorporativo() {
  return (
    <View style={styles.container}>
      <FestivalFeverHeader corporativo />
      <View style={styles.mainLayout}>
        <NavigationContainer theme={theme}>
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
                  <MaterialIcons
                    name="qr-code-scanner"
                    size={26}
                    color={color}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" translucent />
      </View>
    </View>
  );
}
