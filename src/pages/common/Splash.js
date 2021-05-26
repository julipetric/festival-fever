import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

  const [content, setContent] = useState(<InitialNavigator />);

  useEffect(() => {
    switch (profile.userTypeId) {
      case 1:
        setContent(<MainAsistente />);
        break;
      case 2:
        setContent(<MainCorporativo />);
        break;
      default:
        setContent(<InitialNavigator />);
        break;
    }
  }, [profile]);

  return (
    <View enabled style={styles.container} keyboardVerticalOffset={800}>
      {content}
    </View>
  );
}
