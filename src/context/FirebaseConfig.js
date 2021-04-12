import firebase from 'firebase/app';
import { store } from '../redux/store';

export const fbConfig = {
  apiKey: '<FIREBASE_API_KEY>',
  authDomain: 'ewents-festival-fever.firebaseapp.com',
  databaseURL: 'https://ewents-festival-fever.firebaseio.com',
  projectId: 'ewents-festival-fever',
  messagingSenderId: '<FIREBASE_MESSAGING_SENDER_ID>',
  appId: '<FIREBASE_APP_ID>',
};

const rrfConfig = {
  userProfile: 'users',
};

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};
