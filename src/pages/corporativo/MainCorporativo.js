import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PinkPrimary } from '../../assets/Colors';
import HomeCorporativo from './HomeCorporativo';
import FullScreenMapView from '../common/FullScreenMapView';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
});

export default function MainCorporativo() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        activeColor={PinkPrimary}
        initialRouteName="HomeCorporativo"
        headerMode="none"
      >
        <Stack.Screen name="HomeCorporativo" component={HomeCorporativo} />
        <Stack.Screen name="FullScreenMapView" component={FullScreenMapView} />
      </Stack.Navigator>
    </View>
  );
}
