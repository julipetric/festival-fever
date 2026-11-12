// Plantilla de la configuración web de Firebase.
//
// Copiá este archivo como `firebase.config.js` (ignorado por git) y completá los
// valores desde la consola de Firebase: Configuración del proyecto > Tus apps.
// `src/context/FirebaseConfig.js` importa `firebase.config.js`; sin ese archivo
// Metro no puede resolver el módulo y la app no compila.
module.exports = {
  apiKey: '<FIREBASE_API_KEY>',
  authDomain: '<FIREBASE_PROJECT_ID>.firebaseapp.com',
  databaseURL: 'https://<FIREBASE_PROJECT_ID>.firebaseio.com',
  projectId: '<FIREBASE_PROJECT_ID>',
  messagingSenderId: '<FIREBASE_MESSAGING_SENDER_ID>',
  appId: '<FIREBASE_APP_ID>',
  storageBucket: '<FIREBASE_PROJECT_ID>.appspot.com',
};
