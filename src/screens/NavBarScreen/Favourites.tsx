import {DocumentReference, Query, collection} from 'firebase/firestore';
import React, {useState} from 'react';
import {useCollectionData, useDocument} from 'react-firebase-hooks/firestore';
import {SafeAreaView, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {getUserRefByUid} from '../../helpers/users';
import {Meditation, User} from '../../types';
import {fireAuth, fireStore} from '../../lib/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {meditationConverter, styles} from './Home';
import {ToggleTabs} from '../../components/ToggleTabs';
import {MeditationCard} from '../../components/MeditationCard';
import {handleAddFavorite} from '../../helpers/meditations';

export function Favourites() {
  const [currentTab, setCurrentTab] = useState('sound');
  const [currentUser] = useAuthState(fireAuth);
  const [userDoc] = useDocument<User>(
    getUserRefByUid(currentUser?.uid ?? '') as DocumentReference<User>,
    {snapshotListenOptions: {includeMetadataChanges: true}},
  );
  const userFavorites = userDoc?.data()?.favorites;
  const [meditations] = useCollectionData<Meditation>(
    collection(
      fireStore,
      currentTab === 'sound' ? 'audio-meditations' : 'video-meditations',
    ).withConverter(meditationConverter) as Query<Meditation>,
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your favorites</Text>
      <ToggleTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {meditations?.map(
          (el, idx) =>
            userFavorites?.includes(el.id) && (
              <MeditationCard
                isFavorite={userFavorites?.includes(el.id) || false}
                handleAdd={() =>
                  handleAddFavorite({meditationId: el.id, currentUser})
                }
                key={idx}
                id={el.id}
                title={el.title}
                image={el.image}
                duration={el.duration}
              />
            ),
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F7EDE2',
//   },
//   scrollView: {
//     width: '80%',
//   },
// });
