import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';

import PropTypes from 'prop-types';

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

export default function FestivalFeverHeader({ corporativo }) {
  const firebase = useFirebase();

  async function logout() {
    firebase.logout();
  }

  return (
    <View style={styles.container}>
      <Title>FestivalFever{corporativo ? ' CORPORATIVO' : ''}</Title>
      <IconButton
        icon={({ size, color }) => (
          <Entypo name="log-out" size={size} color={color} />
        )}
        onPress={logout}
      />
    </View>
  );
}

FestivalFeverHeader.defaultProps = {
  corporativo: false,
};
FestivalFeverHeader.propTypes = {
  corporativo: PropTypes.bool,
};
