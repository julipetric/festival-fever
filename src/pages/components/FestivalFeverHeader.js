import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';
import { logout as firebaseLogout } from '../../firebase/Auth';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

export default function FestivalFeverHeader() {
  const firebase = useFirebase();

  async function logout() {
    const result = await firebaseLogout(firebase);
    if (result) Alert.alert('success');
    else Alert.alert('fail');
  }

  return (
    <View style={styles.container}>
      <Title>FestivalFever</Title>
      <IconButton
        icon={({ size, color }) => (
          <Entypo name="log-out" size={size} color={color} />
        )}
        onPress={logout}
      />
    </View>
  );
}
