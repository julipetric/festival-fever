import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import MisEventosScreen from '../asistente/MisEventosScreen';
import { PinkPrimary, TransparentBackdrop } from '../../assets/Colors';
import FestivalFeverHeader from '../components/FestivalFeverHeader';
import Eventos from './Eventos';

const Tab = createMaterialBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: TransparentBackdrop,
  },
  mainLayout: {
    flex: 1,
  },
});

function HomeCorporativo() {
  return (
    <View style={styles.container}>
      <FestivalFeverHeader corporativo />
      <View style={styles.mainLayout}>
        <Tab.Navigator
          activeColor={PinkPrimary}
          initialRouteName={t('events')}
          tabBarOptions={{
            activeTintColor: PinkPrimary,
            style: { position: 'absolute' },
          }}
          barStyle={{
            backgroundColor: 'black',
          }}
        >
          <Tab.Screen
            name={t('events')}
            component={Eventos}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="calendar-alt" size={23} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name={t('scanQR')}
            component={MisEventosScreen}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="qr-code-scanner" size={26} color={color} />
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

export default HomeCorporativo;
