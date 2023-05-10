import {runTransaction} from 'firebase/firestore';
import {fireStore} from '../lib/firebase';
import {getUserRefByUid} from './users';

export const handleAddFavorite = async ({
  meditationId,
  currentUser,
}: {
  meditationId: string;
  currentUser: any;
}) => {
  const userRef = getUserRefByUid(currentUser?.uid || '');

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
