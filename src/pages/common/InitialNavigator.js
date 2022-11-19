import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { first } from 'lodash';
import MainCorporativo from '../corporativo/MainCorporativo';
import MainAsistente from '../asistente/MainAsistente';
import AuthNavigator from './AuthNavigator';
import theme from '../../assets/theme';
import { setAttendeeRole } from '../../redux/myStoreSlice';

const Stack = createStackNavigator();

export default function InitialNavigator() {
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const attendeeRole = useSelector(state => state.myStore.attendeeRole);

  useEffect(() => {
    async function fetchRole() {
      const { docs: query } = await firestore.collection('roles').get();
      const role = { ...first(query).data(), id: first(query).id };
      dispatch(setAttendeeRole(role));
    }

    const currentUser = firebase.auth()?.currentUser;
    if (!attendeeRole && currentUser) fetchRole();
  }, [attendeeRole, dispatch, firestore, firebase]);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="AuthNavigator"
        screenOptions={{ headerMode: 'none' }}
      >
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen name="MainCorporativo" component={MainCorporativo} />
        <Stack.Screen name="MainAsistente" component={MainAsistente} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
