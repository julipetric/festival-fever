import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { firebaseReducer } from 'react-redux-firebase';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './slices/userSlice';

const reducers = combineReducers({
  user: userReducer,
  firebase: persistReducer(
    { key: 'firebaseState', storage: AsyncStorage, stateReconciler: hardSet },
    firebaseReducer
  ),
});

const persistConfig = {
  key: 'root',
  whitelist: ['user', 'firebase'],
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
