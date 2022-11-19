import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { ImageBackground, LogBox, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import InitialNavigator from './src/pages/common/InitialNavigator';
import en from './src/assets/locales/en/en';
import image from './src/assets/default_bg.png';
import Providers from './src/context/Providers';
import { fbConfig } from './src/context/FirebaseConfig';
import SplashGate from './src/context/SplashGate';
import initializePolyfill from './src/context/Polyfill';

const styles = StyleSheet.create({
  image: {
    height: '100%',
    resizeMode: 'cover',
  },
});

function initializeLanguage() {
  // Set the key-value pairs for the different languages you want to support.
  i18n.translations = {
    en,
  };
  // Set the locale once at the beginning of your app.
  i18n.defaultLocale = 'en';
  i18n.locale = Localization.locale;
  i18n.fallbacks = true;
}

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);

  initializeLanguage();
  initializePolyfill();

  if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);
    firebase.firestore();
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  } else {
    firebase.app(); // if already initialized, use that one
  }

  return (
    <Providers>
      <ImageBackground source={image} style={styles.image}>
        <SafeAreaView style={styles.image}>
          <SplashGate>
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="light" translucent />
            <InitialNavigator />
          </SplashGate>
        </SafeAreaView>
      </ImageBackground>
    </Providers>
  );
}
