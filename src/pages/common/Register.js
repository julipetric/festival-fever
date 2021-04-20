import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
});

export default function Register() {
  return (
    <View style={styles.container}>
      <Text>REGISTER</Text>
    </View>
  );
}
