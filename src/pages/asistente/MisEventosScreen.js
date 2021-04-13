import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FestivalFeverHeader from '../components/FestivalFeverHeader';

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
      <FestivalFeverHeader />
      <View style={styles.container}>
        <Text>Hello World!</Text>
      </View>
    </>
  );
}
