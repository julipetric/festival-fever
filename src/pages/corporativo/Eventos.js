import React from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { createStackNavigator } from '@react-navigation/stack';
import { PagePaddingHorizontal } from '../../assets/UIConstants';
import EventsHome from './events/EventsHome';
import AddEvent from './events/AddEvent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: PagePaddingHorizontal,
  },
});

const Stack = createStackNavigator();

function Eventos() {
  return (
    <>
      <View style={styles.container}>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name={t('events')} component={EventsHome} />
          <Stack.Screen name={t('addEvent')} component={AddEvent} />
        </Stack.Navigator>
      </View>
    </>
  );
}

export default Eventos;
