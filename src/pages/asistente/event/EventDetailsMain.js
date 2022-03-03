import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BackgroundGray } from '../../../assets/Colors';
import Checkout from '../Checkout';
import Cart from './Cart';
import EventDetails from './EventDetails';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: BackgroundGray,
  },
});

function EventDetailsMain() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="EventDetailsHome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="EventDetailsHome" component={EventDetails} />
        <Stack.Screen name={t('cart')} component={Cart} />
        <Stack.Screen name={t('checkout')} component={Checkout} />
      </Stack.Navigator>
    </View>
  );
}

export default EventDetailsMain;
