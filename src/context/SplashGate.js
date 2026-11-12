import React from 'react';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { useFonts } from 'expo-font';
import Splash from '../assets/splash.png';
import { LogoBackground } from '../assets/Colors';

export default function SplashGate({ children }) {
  const auth = useSelector(state => state.firebase.auth);

  const [fontsLoaded] = useFonts({
    // eslint-disable-next-line global-require
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!isLoaded(auth) || !fontsLoaded)
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: LogoBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={Splash}
          style={{
            height: '100%',
            width: '100%',
          }}
          resizeMode="contain"
        />
      </View>
    );
  return children;
}
