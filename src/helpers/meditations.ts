import {runTransaction} from 'firebase/firestore';
import {fireStore} from '../lib/firebase';
import {getUserRefByUid} from './users';
import {User} from '@firebase/auth';

export const addMeditationToFavourites = async ({
  meditationId,
  currentUser,
}: {
  meditationId: string;
  currentUser: User;
}) => {
  const userRef = getUserRefByUid(currentUser.uid);

  await runTransaction(fireStore, async transaction => {
    const sfDoc = await transaction.get(userRef);
    if (!sfDoc.exists()) {
      throw 'Document does not exist!';
    }

    const prevFavorites = sfDoc.data().favorites;
    const newFavorites = prevFavorites.includes(meditationId)
      ? prevFavorites.filter((e: string) => e !== meditationId)
      : [...prevFavorites, meditationId];

    transaction.update(userRef, {favorites: newFavorites});
  });
};
