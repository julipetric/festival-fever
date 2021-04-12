import React from 'react';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import PropTypes from 'prop-types';
import theme from '../assets/theme';
import { store, persistor } from '../redux/store';
import { rrfProps } from './FirebaseConfig';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ReactReduxFirebaseProvider {...rrfProps}>
          <PaperProvider theme={theme}>{children}</PaperProvider>
        </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  );
}

Providers.propTypes = {
  children: PropTypes.element.isRequired,
};
