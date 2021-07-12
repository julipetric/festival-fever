import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/core';
import { GradientEnd, GradientStart } from '../../../assets/Colors';

import HeaderButton from './HeaderButton';

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
  buttonsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
});

export default function FestivalFeverHeader({ corporativo }) {
  const firebase = useFirebase();

  const navigation = useNavigation();

  async function logout() {
    await firebase.logout();
    navigation.navigate('AuthNavigator');
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={[GradientStart, GradientEnd]}
      end={[0, 1]}
      start={[1, 0]}
    >
      <Title style={{ fontFamily: 'MADE-Evolve-Sans-Bold', fontSize: 30 }}>
        festival fever{corporativo ? ' corporativo' : ''}
      </Title>
      <View style={styles.buttonsContainer}>
        <HeaderButton>
          <IconButton
            icon={() => <FontAwesome5 name="search" size={17} color="white" />}
            onPress={logout}
            style={{ margin: 1 }}
          />
        </HeaderButton>
        <HeaderButton>
          <IconButton
            icon={() => <Ionicons name="person" size={17} color="white" />}
            onPress={logout}
            style={{ margin: 1 }}
          />
        </HeaderButton>
      </View>
    </LinearGradient>
  );
}

FestivalFeverHeader.defaultProps = {
  corporativo: false,
};
FestivalFeverHeader.propTypes = {
  corporativo: PropTypes.bool,
};
