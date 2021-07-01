import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PinkPrimary } from '../../assets/Colors';
import HomeAsistente from './HomeAsistente';
import CategoryDetails from './categories/CategoryDetails';

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
        headerMode="none"
      >
        <Stack.Screen name="HomeAsistente" component={HomeAsistente} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      </Stack.Navigator>
    </View>
  );
}
