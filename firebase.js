// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBO_Egv5oWMnLluECIcKHP7fo5b0NBZvuo',
  authDomain: 'meditations-d428e.firebaseapp.com',
  projectId: 'meditations-d428e',
  storageBucket: 'meditations-d428e.appspot.com',
  messagingSenderId: '603945634276',
  appId: '1:603945634276:web:76b0cc41e0bdf2e3951ff1',
  measurementId: 'G-4NBQ71HLXD',
};

let app;

// Initialize Firebase
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}

export {firebase};
