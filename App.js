import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import Splash from './src/Splash';

export default function App() {
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
