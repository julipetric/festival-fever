import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import myStoreReducer from './myStoreSlice';

const reducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  myStore: myStoreReducer,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
