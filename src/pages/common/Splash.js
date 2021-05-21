import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { View, StyleSheet } from 'react-native';
import MainCorporativo from '../corporativo/MainCorporativo';
import MainAsistente from '../asistente/MainAsistente';
import InitialNavigator from './InitialNavigator';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

export default function Splash() {
  const profile = useSelector(state => state.firebase.profile);

  const content = useRef(<InitialNavigator />);

  useEffect(() => {
    console.log(profile.userTypeId);
  }, [profile]);

  useEffect(() => {
    if (profile) {
      switch (profile.userTypeId) {
        case 1:
          content.current = <MainAsistente />;
          break;
        case 2:
          content.current = <MainCorporativo />;
          break;
        default:
          content.current = <InitialNavigator />;
          break;
      }
    } else content.current = <InitialNavigator />;
  }, [profile]);

  return (
    <View enabled style={styles.container} keyboardVerticalOffset={800}>
      {content.current}
    </View>
  );
}
