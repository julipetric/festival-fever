import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { store, persistor } from './src/redux/store';
import Splash from './src/Splash';
import en from './src/assets/locales/en/en.json';

export default function App() {
  // Set the key-value pairs for the different languages you want to support.
  i18n.translations = {
    en,
  };
  // Set the locale once at the beginning of your app.
  i18n.locale = Localization.locale;
  i18n.defaultLocale = 'en';
  i18n.fallbacks = true;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Splash />
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" translucent />
      </PersistGate>
    </Provider>
  );
}
