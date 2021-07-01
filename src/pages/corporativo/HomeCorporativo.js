import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { PinkPrimary, TransparentBackdrop } from '../../assets/Colors';
import MyEvents from './MyEvents';
import Perfil from '../common/Perfil';

const Drawer = createDrawerNavigator();

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
      <View style={styles.mainLayout}>
        <Drawer.Navigator
          activeColor={PinkPrimary}
          initialRouteName={t('events')}
          /*
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: BackgroundGray },
            headerTintColor: PinkPrimary,
          }}
          */
        >
          <Drawer.Screen
            name={t('myEvents')}
            component={MyEvents}
            options={{
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="calendar-alt" size={23} color={color} />
              ),
              title: t('myEvents'),
            }}
          />
          <Drawer.Screen
            name="Perfil"
            component={Perfil}
            options={{ title: t('profile') }}
          />
        </Drawer.Navigator>
      </View>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" translucent />
    </View>
  );
}

export default HomeCorporativo;
