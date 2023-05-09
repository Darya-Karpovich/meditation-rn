import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {SegmentedButtons, Text} from 'react-native-paper';
import {MeditationCard} from '../../components/MeditationCard';
import {useCollectionData, useDocument} from 'react-firebase-hooks/firestore';
import {fireAuth, fireStore} from '../../lib/firebase';
import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  Query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
} from 'firebase/firestore';
import {Meditation, User} from '../../types';
import {getUserRefByUid} from '../../helpers/users';
import {useAuthState} from 'react-firebase-hooks/auth';
import {handleAddFavorite} from '../../helpers/meditations';

export const meditationConverter: FirestoreDataConverter<Meditation> = {
  toFirestore(meditation: WithFieldValue<Meditation>): DocumentData {
    return {
      title: meditation.title,
      image: meditation.image,
      duration: meditation.duration,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Meditation {
    const data = snapshot.data(options);
    return {
      title: data.title,
      id: snapshot.id,
      image: data.image,
      duration: data.duration,
    };
  },
};

export const Home = () => {
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
      <Text style={styles.title}>Meditations</Text>
      <SegmentedButtons
        value={currentTab}
        onValueChange={setCurrentTab}
        theme={{roundness: 0, border: 'none', fontSize: 40}}
        buttons={[
          {
            value: 'sound',
            label: 'Sound',
            checkedColor: '#A9CDC4',
            uncheckedColor: '#506962',
            style: {
              borderColor: '#F7EDE2',
              borderBottomColor: currentTab === 'sound' ? '#A9CDC4' : '#506962',
              borderBottomWidth: 5,
            },
          },
          {
            value: 'video',
            label: 'Video',
            checkedColor: '#A9CDC4',
            uncheckedColor: '#506962',
            style: {
              borderColor: '#F7EDE2',
              borderBottomColor: currentTab === 'video' ? '#A9CDC4' : '#506962',
              borderBottomWidth: 5,
            },
          },
        ]}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {meditations?.map((el, idx) => (
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7EDE2',
  },
  scrollView: {
    width: '80%',
  },
  title: {
    marginTop: 20,
    fontFamily: 'Judson',
    fontWeight: 'bold',
    fontSize: 48,
    lineHeight: 56,
    color: '#B75755',
  },
});
