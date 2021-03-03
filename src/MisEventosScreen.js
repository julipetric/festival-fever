import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DefaultBackground from './DefaultBackground';
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
    <DefaultBackground>
      <FestivalFeverHeader />
      <View style={styles.container}>
        <Text>Hello World!</Text>
      </View>
    </DefaultBackground>
  );
}
