import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { PagePaddingHorizontal } from '../../assets/UIConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: PagePaddingHorizontal,
  },
});

function Eventos() {
  return (
    <>
      <View style={styles.container}>
        <Text>Hello world!</Text>
      </View>
    </>
  );
}

export default Eventos;
