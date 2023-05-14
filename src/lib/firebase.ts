import {initializeApp} from 'firebase/app';
import {browserLocalPersistence, getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBO_Egv5oWMnLluECIcKHP7fo5b0NBZvuo',
  authDomain: 'meditations-d428e.firebaseapp.com',
  projectId: 'meditations-d428e',
  storageBucket: 'meditations-d428e.appspot.com',
  messagingSenderId: '603945634276',
  appId: '1:603945634276:web:76b0cc41e0bdf2e3951ff1',
  measurementId: 'G-4NBQ71HLXD',
};

export const fireApp = initializeApp(firebaseConfig);
export const fireAuth = getAuth(fireApp);
export const fireStore = getFirestore(fireApp);

fireAuth.setPersistence(browserLocalPersistence);

export enum Collections {
  AudioMeditation = 'audio-meditations',
  Users = 'users',
  VideoMeditations = 'video-meditations',
}
