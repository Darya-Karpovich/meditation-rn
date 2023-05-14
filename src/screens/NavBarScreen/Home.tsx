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
  orderBy,
  query,
} from 'firebase/firestore';
import {Meditation, NavigationScreenProps, Routes, User} from '../../types';
import {getUserRefByUid} from '../../helpers/users';
import {useAuthState} from 'react-firebase-hooks/auth';
import {addMeditationToFavourites} from '../../helpers/meditations';
import {MeditationSortBy} from '../../lib/consts';

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
      url: data.content,
      createdAt: data.createdAt,
    };
  },
};

export const Home = ({navigation}: NavigationScreenProps<Routes.Home>) => {
  const [currentTab, setCurrentTab] = useState('sound');
  const [currentUser] = useAuthState(fireAuth);
  const [userDoc] = useDocument<User>(
    getUserRefByUid(currentUser?.uid ?? '') as DocumentReference<User>,
    {snapshotListenOptions: {includeMetadataChanges: true}},
  );
  const userFavorites = userDoc?.data()?.favorites;

  const [meditations] = useCollectionData<Meditation>(
    query(
      collection(
        fireStore,
        currentTab === 'sound' ? 'audio-meditations' : 'video-meditations',
      ),
      orderBy(MeditationSortBy.CreatedAt, 'desc'),
    ).withConverter(meditationConverter) as Query<Meditation>,
  );

  if (!currentUser) {
    return null;
  }

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
        {meditations?.map((meditation, idx, arrayRef) => (
          <MeditationCard
            isFavorite={userFavorites?.includes(meditation.id) || false}
            onLike={() =>
              addMeditationToFavourites({
                meditationId: meditation.id,
                currentUser,
              })
            }
            onClick={() => {
              navigation.navigate(Routes.Meditation, {
                id: meditation.id,
                prevId: arrayRef[(idx - 1) % arrayRef.length].id,
                nextId: arrayRef[(idx + 1) % arrayRef.length].id,
              });
            }}
            meditation={meditation}
            key={idx}
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
