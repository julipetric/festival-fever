import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PinkPrimary } from '../../assets/Colors';
import HomeAsistente from './HomeAsistente';
import MyAccount from '../common/MyAccount';
import FestivalFeverHeader from '../components/Header/FestivalFeverHeader';

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
        activeColor={PinkPrimary}
        initialRouteName="HomeCorporativo"
        screenOptions={{ header: () => <FestivalFeverHeader /> }}
      >
        <Stack.Screen name="HomeAsistente" component={HomeAsistente} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
      </Stack.Navigator>
    </View>
  );
}
