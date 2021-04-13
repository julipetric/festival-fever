import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View } from 'react-native';
import MainCorporativo from '../corporativo/MainCorporativo';
import MainAsistente from '../asistente/MainAsistente';
import Login from './Login';
import { setValidSession } from '../../redux/slices/userSlice';

export default function Splash() {
  const validSession = useSelector(state => state.user.validSession);

  const userTypeId = useSelector(state => state.user.userTypeId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setValidSession(true));
  }, [dispatch]);

  let content = null;

  switch (userTypeId) {
    case 1:
      content = <MainAsistente />;
      break;
    case 2:
      content = <MainCorporativo />;
      break;
    default:
      content = <Login />;
      break;
  }

  return (
    <>
      {content}
      {!validSession && (
        <View>
          <Text>Hello world!</Text>
        </View>
      )}
    </>
  );
}
