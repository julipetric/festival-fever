import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { Provider as PaperProvider } from 'react-native-paper';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, persistor } from './src/redux/store';
import Splash from './src/Splash';
import en from './src/assets/locales/en/en.json';
import theme from './src/assets/theme';
import image from './assets/default_bg.png';

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

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <ImageBackground source={image} style={styles.image}>
            <SafeAreaView>
              {/* eslint-disable-next-line react/style-prop-object */}
              <StatusBar style="light" translucent />
              <Splash />
            </SafeAreaView>
          </ImageBackground>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
