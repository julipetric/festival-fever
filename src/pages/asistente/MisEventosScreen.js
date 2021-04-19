import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function MisEventosScreen() {
  return (
    <>
      <View style={styles.container}>
        <Text>Mis Eventos</Text>
      </View>
    </>
  );
}
