import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { firebaseReducer, actionTypes } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

const reducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [actionTypes.LOGIN, actionTypes.LOGIN_ERROR],
    },
  }),
});

export default store;
