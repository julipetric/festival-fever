import firebase from 'firebase/app';
import { createFirestoreInstance } from 'redux-firestore';
import store from '../redux/store';
import firebaseConfig from '../../firebase.config';

// Los valores salen de `firebase.config.js` (ver `firebase.config.example.js`).
export const fbConfig = firebaseConfig;

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
