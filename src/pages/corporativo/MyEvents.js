import React from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { createStackNavigator } from '@react-navigation/stack';
import EventsHome from './events/EventsHome';
import AddEvent from './events/AddEvent';
import EventDetails from './events/EventDetails';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

const Stack = createStackNavigator();

function MyEvents() {
  return (
    <>
      <View style={styles.container}>
        <Stack.Navigator screenOptions={{ headerMode: 'none' }}>
          <Stack.Screen name={t('events')} component={EventsHome} />
          <Stack.Screen name={t('addEvent')} component={AddEvent} />
          <Stack.Screen name={t('eventDetails')} component={EventDetails} />
        </Stack.Navigator>
      </View>
    </>
  );
}

export default MyEvents;
