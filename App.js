import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from 'firebase/app';
import Splash from './src/Splash';
import en from './src/assets/locales/en/en.json';
import image from './assets/default_bg.png';
import Providers from './src/context/Providers';
import { fbConfig } from './src/context/FirebaseConfig';
import AuthGate from './src/context/AuthGate';

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
});

function initializeLanguage() {
  // Set the key-value pairs for the different languages you want to support.
  i18n.translations = {
    en,
  };
  // Set the locale once at the beginning of your app.
  i18n.locale = Localization.locale;
  i18n.defaultLocale = 'en';
  i18n.fallbacks = true;
}

export default function App() {
  initializeLanguage();

  if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  return (
    <Providers>
      <ImageBackground source={image} style={styles.image}>
        <SafeAreaView>
          <AuthGate>
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="light" translucent />
            <Splash />
          </AuthGate>
        </SafeAreaView>
      </ImageBackground>
    </Providers>
  );
}
