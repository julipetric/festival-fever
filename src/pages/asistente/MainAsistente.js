import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'i18n-js';
import HomeAsistente from './HomeAsistente';
import MyAccount from '../common/myAccount/MyAccount';
import FestivalFeverHeader from '../components/Header/FestivalFeverHeader';
import SearchScreen from './SearchScreen';
import FullScreenMapView from '../common/FullScreenMapView';
import EventDetailsMain from './event/EventDetailsMain';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
});

export default function MainAsistente() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="HomeCorporativo"
        screenOptions={{ header: () => <FestivalFeverHeader /> }}
      >
        <Stack.Screen name="HomeAsistente" component={HomeAsistente} />
        <Stack.Screen
          name={t('myAccount')}
          component={MyAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={t('search')} component={SearchScreen} />
        <Stack.Screen
          name={t('eventDetails')}
          component={EventDetailsMain}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FullScreenMapView"
          component={FullScreenMapView}
          initialParams={{ hideDoneButton: true }}
        />
      </Stack.Navigator>
    </View>
  );
}
