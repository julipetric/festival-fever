import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});

export default function FestivalFeverHeader() {
  return (
    <View style={styles.container}>
      <Text>FestivalFever</Text>
    </View>
  );
}
