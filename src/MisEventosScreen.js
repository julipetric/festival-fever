import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import FestivalFeverHeader from './FestivalFeverHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function MisEventosScreen() {
  const [astrises, setAstrises] = useState([1]);

  return (
    <>
      <FestivalFeverHeader />
      <View style={styles.container}>
        <Text>Hello World!</Text>
      </View>
    </>
  );
}
