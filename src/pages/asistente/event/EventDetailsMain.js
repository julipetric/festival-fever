import { useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BackgroundGray } from '../../../assets/Colors';
import ConfirmOrder from '../ConfirmOrder';
import BuyTickets from './BuyTickets';
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
  const route = useRoute();
  const { eventId } = route.params;

  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="EventDetailsHome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="EventDetailsHome"
          component={EventDetails}
          initialParams={{ eventId }}
        />
        <Stack.Screen name={t('buyTickets')} component={BuyTickets} />
        <Stack.Screen name={t('confirmOrder')} component={ConfirmOrder} />
      </Stack.Navigator>
    </View>
  );
}

export default EventDetailsMain;
