import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { useFonts } from 'expo-font';

export default function SplashGate({ children }) {
  const auth = useSelector(state => state.firebase.auth);

  const [fontsLoaded] = useFonts({
    // eslint-disable-next-line global-require
    'MADE-Evolve-Sans-Bold': require('../assets/fonts/MADE-Evolve-Sans-Bold.otf'),
  });

  if (!isLoaded(auth) || !fontsLoaded)
    return (
      <View>
        <Text>splash screen...</Text>
      </View>
    );
  return children;
}
