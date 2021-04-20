import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { useFirebase } from 'react-redux-firebase';
import MainCorporativo from '../corporativo/MainCorporativo';
import MainAsistente from '../asistente/MainAsistente';
import InitialNavigator from './InitialNavigator';

export default function Splash() {
  const firebase = useFirebase();

  const validSession = useSelector(state => state.user.validSession);

  const userTypeId = useSelector(state => state.user.userTypeId);
  const { currentUser } = firebase.auth();

  const content = useRef();

  useEffect(() => {
    // console.log({ currentUser, userTypeId });
    if (currentUser) {
      switch (userTypeId) {
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
  }, [currentUser, userTypeId]);

  return (
    <>
      {content.current}
      {!validSession && (
        <View>
          <Text>Hello world!</Text>
        </View>
      )}
    </>
  );
}
