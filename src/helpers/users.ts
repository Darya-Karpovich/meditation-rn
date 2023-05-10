import {setDoc, doc} from 'firebase/firestore';
import {fireStore} from '../lib/firebase';
import {User} from '../types';

export const modifyUser = (uid: string, payload: Partial<User>) => {
  const userRef = getUserRefByUid(uid);
  return setDoc(userRef, payload);
};

export const getUserRefByUid = (uid: string) => {
  return doc(fireStore, 'users', uid);
};
