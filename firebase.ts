import {initializeApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';

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
const apps = getApps();

if (!apps.length) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps.pop();
}

export const firebaseAuth = getAuth();
export const firebaseApp = app;
