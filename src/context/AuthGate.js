import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

export default function AuthGate({ children }) {
  const auth = useSelector(state => state.firebase.auth);
  console.log(useSelector(state => state));
  if (!isLoaded(auth))
    return (
      <View>
        <Text>splash screen...</Text>
      </View>
    );
  return children;
}
