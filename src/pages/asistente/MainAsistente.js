import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import MisEventosScreen from './MisEventosScreen';
import { PinkPrimary } from '../../assets/Colors';
import ExplorarScreen from './ExplorarScreen';
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

export default function MainAsistente() {
  return (
    <View style={styles.container}>
      <FestivalFeverHeader />
      <View style={styles.mainLayout}>
        <Tab.Navigator
          activeColor={PinkPrimary}
          initialRouteName={t('myEvents')}
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
            name={t('explore')}
            component={ExplorarScreen}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <FontAwesome name="search" size={23} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" translucent />
    </View>
  );
}
