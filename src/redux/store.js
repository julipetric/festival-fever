import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import eventsReducer from './slices/eventsSlice';

const reducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  events: eventsReducer,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
